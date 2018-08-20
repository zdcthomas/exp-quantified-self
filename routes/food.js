var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const pry = require('pryjs')

router.get('/', (request, response)=>{
  database('foods').select()
    .then((foods)=>{
      response.status(200).json(foods)
    })
    .catch((error)=>{
      response.status(500).json({error})
    });
});

router.get('/:id', (request, response)=>{
  let id = request.params.id
  database('foods').select().where({id: id})
  .then((food)=>{
    if (food.length) {
      response.status(200).json(food[0])
    } else {
      response.status(404).json({error: "Food reference could not be found"})
    }
  })
  .catch((error)=>{
      
  });
});

module.exports = router;
