import * as jwt from 'jsonwebtoken';
import * as jwtExpress from 'express-jwt';
import config from 'config';

import { MINUTE } from 'services/time';

export interface UserData {
  sub: number;
  exp?: Number;
}

export const ACCESS_TOKEN_LIVE_TIME = 30 * MINUTE;

interface UserTokenData {
  username: string;
  sub: string;
  exp?: number;
}

export function isAccessTokenValid(accessToken: string) {
  try {
    const validatedToken = jwt.verify(accessToken, config.jwtSecret);
    return validatedToken && true;
  } catch (e) {
    return false;
  }
}

export function validateAccessTokenOrThrow(accessToken: string) {
  if (!isAccessTokenValid(accessToken)) {
    throw new Error(`Invalid access token.`);
  }
}

export function getAccessTokenData(accessToken) {
  validateAccessTokenOrThrow(accessToken);
  const tokenData: UserTokenData = jwt.decode(accessToken) as UserTokenData;
  return tokenData;
}

export function doesAccessTokenMatchUser(accessToken: string, user: User) {
  validateAccessTokenOrThrow(accessToken);
  const tokenData = getAccessTokenData(accessToken);
  return tokenData.sub === user.id;
}

export function hasAccessTokenExpired(accessToken: string) {
  validateAccessTokenOrThrow(accessToken);
  const tokenData = getAccessTokenData(accessToken);
  const timeNow = Date.now();
  if (!tokenData.exp) {
    return true;
  }
  if (tokenData.exp > timeNow) {
    return true;
  }
  return false;
}

export function getUserAccessToken({ username, id }: User) {
  const exp = Date.now() + ACCESS_TOKEN_LIVE_TIME;
  return jwt.sign(
    {
      username,
      sub: id,
      exp,
    },
    config.jwtSecret
  );
}

export const jwtExpressMiddleware = jwtExpress({
  secret: config.jwtSecret,
  requestProperty: 'auth',
  credentialsRequired: false,
});
