import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());

export default app;