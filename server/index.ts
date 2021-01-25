import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as httpStatus from 'http-status';
import { ResponseApi } from './models/model.type';
import { generateRouters } from './routers/v1';

// config .env variables
if (process.env.NODE_ENV === 'development') {
  const config = {
    path: `${__dirname}/../.env.development`,
  };
  dotenv.config(config);
} else {
  dotenv.config();
}

// create server express
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
    // abortOnLimit: true
  })
);

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

generateRouters(app);

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    const response: ResponseApi = {
      isOk: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'NOT_FOUND',
      data: null,
    };
    res.status(httpStatus.NOT_FOUND).json(response);
    next();
  }
);

// Mongo connect
const urlMongo = process.env.URL_MONGO || '';
mongoose
  .connect(urlMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`\n mongo db 🚀`);
  })
  .catch((error) => {
    console.log(`\n🤬 mongo db 🤬`);
    console.log(`\n ${error}`);
  });

// server OK
app.listen(process.env.PORT, () => {
  console.log(`\n express server ok: port ${process.env.PORT} 🚀`);
});
