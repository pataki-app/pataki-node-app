import * as express from 'express';
import * as bodyParser from 'body-parser';

process.env.PORT = '3000';

const app = express();

const data = [
  {
    userId: 123,
    usuario: 'example 1',
    password: '123456',
  },
  {
    userId: 124,
    usuario: 'example 2',
    password: '123456',
  },
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/usuarios', (req: any, res) => {
  res.json(data);
});
app.listen(process.env.PORT, () => {
  console.log(`\n express server ok: port ${process.env.PORT} 🚀`);
});
