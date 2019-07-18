import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';

import { ErrorWithStatus } from '~lib/types';
import { RootRoutes } from './api';
import { configs } from '~config';
import { queryStringMapper } from '~lib/qs-utils';
import { stream } from '~lib/logger';

export class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.configure();
  }

  private configure(): void {
    this.express.use(morgan('combined', {
      stream,
    }));
    this.express.use(cors());
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: false,
    }));
    this.express.use(cookieParser(configs.COOKIE.SECRET));
    this.express.use(methodOverride((req) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;

        return method;
      }
    }));
    this.express.use(queryStringMapper());
    this.express.get('/favicon.ico', (req, res) => {
      res.sendStatus(204);
    });
    this.express.use(configs.API_ROOT, new RootRoutes().router);
    this.express.use((req, res, next) => {
      const err: ErrorWithStatus = new Error('Not Found');
      err.status = 404;
      next(err);
    });
  }
}
