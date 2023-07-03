import { UserForToken } from '../../src/sequelize/models/user.model';

export {};

declare module 'jsonwebtoken' {
  export interface JwtPayload extends UserForToken {
    nil: string;
  }
}
