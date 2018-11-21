It was starting point for my friend to create api for fb messaging for his MacOS messanger app



`yarn install`

`yarn dev`

To create session -

`POST` to `localhost:3000/login` with email and password as data. You'll get encoded session in response. You need to send this session with every request

`POST` to `localhost:3000/message` with `message` and `threadId` data to send message.
