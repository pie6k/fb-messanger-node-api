import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createServer } from 'http';

import * as fbLogin from 'facebook-chat-api';

export async function getApi(email: string, password: string) {
  const logging = new Promise<any>((resolve, reject) => {
    fbLogin({ email, password }, (err, api) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(api);
    });
  });
  return await logging;
}

export async function getApiFromAppState(appState: Object) {
  const logging = new Promise<any>((resolve, reject) => {
    fbLogin({ appState }, (err, api) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(api);
    });
  });
  return await logging;
}
