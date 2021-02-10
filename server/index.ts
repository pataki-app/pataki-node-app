import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { ResponseApi } from './models/model.type';
import UserModel, { UserDoc } from './models/user.model';
import { RoleUser } from './models/user.type';
import { generateRouters } from './routers/v1';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

const saltOrRounds = parseInt(process.env.SALT || '10');

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
  })
);
const secretKey = process.env.SESSION_KEY || 'secretKey';
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
    console.log(`\n mongo db ok 🚀🚀🚀`);
    UserModel.findOne(
      { email: 'admin@pataki.com' },
      (error: mongoose.CallbackError, user: UserDoc) => {
        if (!user) {
          const data = {
            name: 'admin',
            email: 'admin@pataki.com',
            password: bcrypt.hashSync('pataki123', saltOrRounds),
            role: RoleUser.admin,
          };
          new UserModel(data).save();
        }
      }
    );
  })
  .catch((error) => {
    console.log(`\n🤬 mongo db 🤬`);
    console.log(`\n ${error}`);
  });

// server OK
app.listen(process.env.PORT, () => {
  console.log(`\n express server ok: port ${process.env.PORT} 🚀🚀🚀`);
});
