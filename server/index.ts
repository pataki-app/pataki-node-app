import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
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

generateRouters(app);

// server OK
app.listen(process.env.PORT, () => {
  console.log(`\n express server ok: port ${process.env.PORT} 🚀`);
});
