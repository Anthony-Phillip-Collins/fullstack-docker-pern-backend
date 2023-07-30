import bcrypt from 'bcrypt';
import { StatusCodes } from '../../types/errors.type';
import { UserForToken, UserLogin, UserWithToken } from '../../types/user.type';
import User from '../models/user.model';
import tokenizer from '../util/tokenizer';
import getError from '../../types/utils/getError';

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
    id: user.id,
  };

  return await tokenizer.signTokens(userForToken);
};

const authService = {
  login,
  logout: tokenizer.endSession,
};

export default authService;
