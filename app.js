import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import chalk from 'chalk';
import db from './db';

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

const collection = 'todo';

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

app.post('/', (req, res) => {
  const userInput = req.body;
  db.getDB().collection(collection).insertOne(userInput, (err, result) => {
    if (err) console.log(err);
    else {
      res.json({ result, document: result.ops[0] });
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
