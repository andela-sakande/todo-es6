import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import chalk from 'chalk';
import Joi from 'joi';
import db from './db';

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

const collection = 'todo';

const schema = Joi.object().keys({
  todo: Joi.string().required(),
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../index.html'));
});

app.get('/getTodos', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    res.json(documents);
  });
});

app.put('/:id', (req, res) => {
  const todoID = req.params.id;
  const userInput = req.body;

  db.getDB().collection(collection)
    .findOneAndUpdate({ _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false }, (err, result) => {
        if (err) console.log(err);
        else {
          res.json(result);
        }
      });
});

app.post('/', (req, res, next) => {
  const userInput = req.body;

  Joi.validate(userInput, schema, (err, result) => {
    if (err) {
      const error = new Error('Invalid input');
      error.status = 400;
      next(error);
    } else {
      db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if (err) {
          const error = new Error('Failed to insert');
          error.status = 400;
          next(error);
        } else {
          res.json({
            result, document: result.ops[0], msg: 'Successfully Inserted', error: null,
          });
        }
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  const todoID = req.params.id;
  db.getDB().collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
      if (err) console.log(err);
      else {
        res.json(result);
      }
    });
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: {
      msg: err.message,
    },
  });
});

db.connect((err) => {
  if (!err) {
    app.listen(PORT, () => {
      /* eslint-disable no-console */
      console.log(chalk.blue(`Listening on Port ${3000}`));
    });
  } else {
    /* eslint-disable no-console */
    console.log(chalk.red('unable to connect to database'));
    process.exit(1);
  }
});
