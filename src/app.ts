require('dotenv').config();
import express from 'express';
require('./config/db');
import indexRouter from './modules/storage/storage.api';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * @description health check router
 */
app.get('/health', (req, res) => res.status(200).send);
app.use('/', indexRouter);

export default app;
