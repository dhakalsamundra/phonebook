require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Person = require('./models/person');


app.use(express.static('build'));
app.use(express.json());

app.use(cors());
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons.map((person) => person.toJSON()));
  });
});

app.post('/api/persons', (request, response) => {
  const phonebook = request.body;
  

  if (phonebook.name === undefined) {
    return response.status(400).json({
      error: 'name is missing',
    });
  } else if (phonebook.number === undefined) {
    return response.status(400).json({
      error: 'Number is missing',
    });
  } 

  const person = new Person ({
    name: phonebook.name,
    number: phonebook.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  });
});

app.get('/api/persons/:id', (req, res, next) => {
Person.findById(req.params.id).then(person => {
  if(person) {
    res.json(person.toJSON())
  } else {
    res.status(404).end()
  }
})
.catch(err => next(err))
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(err => NodeList(err))
});

app.put('/api/persons/:id', (req, res, next) => {
  const phonebook = req.body

  const person = {
    name: phonebook.name,
    number: phonebook.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
          res.json(updatedPerson.toJSON())
        })
        .catch(err => next(err))
})

app.get('/info', (req, res) => {
  const newDate = new Date();
  const details = `Phonebook have info for 4 people. <br/><br/> ${newDate}`;
  res.send(details);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint. This should be at the very end of the just after the unknown endpoint handlers becuase if it placed before the requests.
//if done like so, then no routes and middleware will be called after the response has been sent by the unknown endpoint.
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});