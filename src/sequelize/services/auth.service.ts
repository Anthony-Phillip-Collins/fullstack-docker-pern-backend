import bcrypt from 'bcrypt';
import { StatusCodes } from '../../types/errors.type';
import { UserForToken, UserLogin, UserWithToken } from '../../types/user.type';
import { getError } from '../../util/middleware/errorHandler';
import User from '../models/user.model';
import tokenizer from '../util/tokenizer';

const login = async (login: UserLogin): Promise<UserWithToken | null> => {
  const { username, password } = login;
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw getError({ message: 'User does not exist.', status: StatusCodes.NOT_FOUND });
  }

  const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

  if (!passwordCorrect) {
    throw getError({ message: 'Invalid username or password.', status: StatusCodes.UNAUTHORIZED });
  }

  const userForToken: UserForToken = {
    username,
    name: user.name,
  };

  return await tokenizer.signTokens(userForToken);
};

const authService = {
  login,
  logout: tokenizer.endSession,
};

export default authService;
