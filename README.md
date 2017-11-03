# CK-BOARD
heroku domain: https://infinite-plateau-29080.herokuapp.com/

# Boilerplate (based on create-react-app & webpack-dev-middleware & webpack-hot-middleware)

This boilerplate takes only the essential parts of the configurations used by the [create-react-app](https://github.com/facebookincubator/create-react-app), and serves the client-side react application directly via express framework using [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) instead of webpack-dev-server.

These middlewares will be triggered only during development, and the server will simply serve the index.html and its assets in the build folder in production.

This means that when the client-side react application makes an http request to the server, the request will be made to the very same server that is also serving the application.

For example, axios GET request would look like the following in this boilerplate.

```js
// no need to resolve urls depending on whether it's production or development
componentDidMount() {
    axios.get('/api/test').then(res => console.log(res.data));
}
```

The way you handle this HTTP request in the express is not any different from a normal express application

```js
app.get('/api/test', (req, res) => {
    res.send('This is working !!!');
});
```

## What's different from create-react-app
* support for sass added
* customizable build directory
* following snippet MUST be added to the react's index.js file to enable hot-reloading during development.
```js
if (module.hot) {
    module.hot.accept();
}
```
* react application will reside in ./client/src
* back-end code will reside in ./server
* a separate index.html file ('./client/public/index.dev.html') will be created to support react-router-dom during development. However, this file is needed only for development.

## How to start the development server

```sh
npm run dev
```
This will simply start the usual express server, which will be used as our back-end server. This server also bundles the client-side react application and serves it. The server will hot-reload the client-side application whenever you make a change in the react's code ('./client/src'). Any changes in the server-side codes will restart the server using [nodemon](https://github.com/remy/nodemon)

## How to compile the client-side react application for production

```sh
npm run build
```
This will do nothing but compiling the production version of the client-side react application.

## How to start the whole app (bundle the react app and then start serving it in express)

```sh
npm start
```
This will compile the production of the client-side react application and then start the express server. This is meant for production use only.

## How to add environment variables
### for development
create a `.env.development` file in ./client/config/env directory and set custom environment variables like the following example
```
REACT_APP_SECRET_CODE=abcdef
```
* important: the variable name has to have a prefix `REACT_APP_`
### for production
create a `.env.production` file in ./client/config/env directory

## How to use a different build directory
enter the path to the new directory for build in ./client/config/utils/path.js
```js
// replace 'client/build' with the new build directory
appBuild: resolveApp('client/build'),
```
