import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Base64 } from 'js-base64';
import { createServer } from 'http';

import { getApi, getApiFromAppState } from 'services/fb';

import * as fbLogin from 'facebook-chat-api';

const app = express();

app.use(bodyParser.json());

app.use(async function(req, res, next) {
  const { session } = req.body;
  if (!session) {
    next();
  }
  const api = await getApiFromAppState(JSON.parse(Base64.decode(session)));
  req.fbApi = api;
  next();
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const api = await getApi(email, password);
    const sessionData = Base64.encode(JSON.stringify(api.getAppState()));

    res.send({ session: sessionData });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post('/message', async (req, res) => {
  const { message, threadId } = req.body;
  req.fbApi.sendMessage(message, threadId, () => {
    res.send('sent');
  });
});

async function startServer(port: number) {
  // create db connection so all db calls later on does not need to use async connection promise
  const server = createServer(app);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
}

startServer(3000);
