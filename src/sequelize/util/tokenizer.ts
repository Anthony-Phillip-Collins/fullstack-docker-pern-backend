import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../../config';
import redis from '../../redis';
import { StatusCodes } from '../../types/errors.type';
import { UserForToken, UserWithToken } from '../../types/user.type';
import { parseUserForToken } from '../../types/utils/parsers/user.parser';
import { getError } from '../../util/middleware/errorHandler';
import User from '../models/user.model';

const signAccessToken = (userForToken: UserForToken): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    jwt.sign(userForToken, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY }, (err, token) => {
      if (err) {
        reject(
          getError({
            message: err?.message || 'Error signing access token.',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          })
        );
      } else {
        resolve(token);
      }
    });
  });

const verifyAccessToken = (token: string): Promise<string | jwt.JwtPayload | undefined> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(
          getError({
            message: err?.message || 'Error verifying access token.',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          })
        );
      } else {
        resolve(decoded);
      }
    });
  });

const signRefreshToken = async (userForToken: UserForToken): Promise<string | undefined> => {
  const token = jwt.sign(userForToken, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  if (!token) {
    throw getError({ message: 'Error signing refresh token.', status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  try {
    await redis.set(userForToken.username, token);
  } catch (err) {
    throw getError({ message: 'Error setting refresh token.', status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  return token;
};

const verifyRefreshToken = async (token: string): Promise<UserForToken | undefined> => {
  const decoded = parseUserForToken(jwt.verify(token, REFRESH_TOKEN_SECRET));
  const cached = await redis.get(decoded.username);

  if (cached !== token) {
    await endSession(decoded.username);

    throw getError({
      message: 'Error verifying refresh token.',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return decoded;
};

const deleteRefreshToken = async (username: string): Promise<void> => {
  try {
    await redis.del(username);
  } catch (err) {
    throw getError({
      message: 'Error deleting refresh token.',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const signTokens = async (payload: UserForToken): Promise<UserWithToken | null> => {
  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);

  if (!accessToken || !refreshToken) {
    throw getError({ message: 'Error signing token.', status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  await enableUser(payload.username);

  return { accessToken, refreshToken, ...payload };
};

const enableUser = async (username: string): Promise<void> => {
  try {
    await User.update({ disabled: false }, { where: { username } });
  } catch (err) {
    throw getError({
      message: 'Error enabling user.',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const endSession = async (username: string): Promise<void> => {
  try {
    await User.update({ disabled: true }, { where: { username } });
    await deleteRefreshToken(username);
  } catch (err) {
    throw getError({
      message: 'Error ending session.',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const tokenizer = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  endSession,
  signTokens,
};

export default tokenizer;
