import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';

import configs from './config';
import rootRoutes from './api';

import { ErrorWithStatus } from '~lib/types';
import { stream } from '~lib/logger';

class App {
  public express;

  constructor() {
    this.express = express();

    this.configure = this.configure.bind(this);
  }

  public configure(): express.Express {
    this.express.use(morgan('combined', {
      stream,
    }));
    this.express.use(cors());
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: false,
    }));
    this.express.use(cookieParser());
    this.express.use(methodOverride((req) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;

        return method;
      }
    }));
    this.express.get('/favicon.ico', (req, res) => {
      res.sendStatus(204);
    });
    this.express.use(configs.API_ROOT, rootRoutes);
    this.express.use((req, res, next) => {
      const err: ErrorWithStatus = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    return this.express;
  }

}

export default new App().configure();
