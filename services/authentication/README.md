# Node.js TypeScript Rest Api Boilerplate

## Overview

Built on top of [AdeptMind Boilerplate NodeJS Service](https://github.com/AdeptMind/adept-rest-api-postgres-boilerplate), this repository is a boilerplate for a [NodeJS](https://nodejs.org/en/) and [TypeScript](https://www.typescriptlang.org/) based RESTful service using [ExpressJS](https://expressjs.com/en/guide/routing.html) as a server framework.

## Available Configurations for the application

- copy `.env.example` into `.env` file with necessary values in it
- modify `paths` value in `compilerOptions` in `tsconfig.json` as needed to use TypeScript's [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
    - make sure these paths are also whitelisted in TSLint's `no-implicit-dependencies` [rule](https://palantir.github.io/tslint/rules/no-implicit-dependencies/) and `no-submodule-imports` [rule](https://palantir.github.io/tslint/rules/no-submodule-imports/) in `tslint.json` file to suppress lint errors.
    - these paths should also be mapped in Jest's `moduleNameMapper` [setting](https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string) found in `package.json` for the test to work
    - this boilerplate has been configured to map `./src/lib` and `./src/config` so that they can be imported like `@lib` and `@config` anywhere in the project.

## How to run the application for development

- run `npm install`
- run `npm run start:dev`

## How to test the application

- make sure test files are named as either `*.spect.ts` or `*.test.ts` inside `./src` directory.
- setup the jest testing in `./src/tests/setup.js`
- run `npm test`
- run `npm run test:watch` to run the test in a watch mode

## How to compile & build the application for production

- run `npm run build` (this compiles TypeScipt files from `./src` directory to `./dist` directory and also uses a TypeScript path re-mapper called [tspm](https://github.com/ef-carbon/tspm) to re-write paths in JavaScript file based on mappings found in `.tsconfig.json`)
- run `npm start`

## Available NPM commands for the application

- `npm run build`: Compiles TypeScript source codes into JavaScript files in a directory specified in `tsconfig.json`'s
- `npm run lint`: Runs tslint against all TypeScript files inside `src` directory
- `npm run lint:fix`: Runs tslint against all TypeScript files inside `src` directory and fixes errors
- `npm run postbuild`: Re-write paths mapping in compiled JavaScript files based on mappings found in `.tsconfig.json`
- `npm start`: Starts the application that has been compiled into JavaScript
- `npm run start:dev`: Starts the application for development (without compiling)
- `npm run test`: Tests the application
- `npm run test`: Tests the application in watch mode

## Project structure

    ├── .env.example: environment variables that MUST be configured in order for the app to start
    ├── src
    │   ├── api
    │   │   ├── index.js
    │   │   ├── {REST endpoint directory}
    │   │   │   ├── controller.js
    │   │   │   ├── index.js
    │   │   └───└── test.spec.js
    │   ├── config
    │   │   └── index.js: Loads environment variables into an object
    │   ├── lib: Common utilility functions that are used throughout the application
    │   │   └── responses.js: Call these when returning (`success`, `error`, `redirect`)
    │   ├── tests: Test setup files and other utilities relevant to testing
    │   ├── app.js: Express initialization
    └───└── index.js: Http server initialization

## Configuration (.env variables)

`API_ROOT`: The prefix path for all endpoints associated with this service. For example, setting to `/api` would change the entry point of the service to `https://{HOSTNAME}/api`.

`NODE_ENV`: [For express.js.](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)

`PORT`: The port that the application is bound to

`LOG_LEVEL`: This can be any of the following `debug`, `info`, `warn`, `error` and will filter out any console prints that is less severe than the level specified. The default is `debug` for development purposes. It is recommended to use `warn` on production deployments.

## Logging

Consult the AdeptMind Boilerplate NodeJS Service boilerplate's [documentation](https://github.com/AdeptMind/adept-rest-api-postgres-boilerplate#logging)
