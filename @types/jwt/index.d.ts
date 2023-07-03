import { UserForToken } from '../../src/types/user.type';

export {};

declare module 'jsonwebtoken' {
  export interface JwtPayload extends UserForToken {
    nil: string;
  }
}
