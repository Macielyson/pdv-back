import mongoose from 'mongoose';
const URI = 'mongodb://127.0.0.1:27017/pdv';

const env = process.env.NODE_ENV || 'dev';
let options = {};

mongoose
  .connect(URI, options)
  .then(() => console.log('DB is Up!')) // ao terminar
  .catch((err) => console.log(err)); // caso der error
