var express = require('express');
var router = express.Router();
var cors = require('cors')
const Food = require('../models/food')

express().use(cors())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const pry = require('pryjs')
router.use(cors());


router.get('/', cors(), (request, response, next)=>{
  database('foods').select()
    .then((foods)=>{
      response.status(200).json(foods)
    })
    .catch((error)=>{
      response.status(500).json({error})
    });
});

router.get('/:id', cors(), (request, response, next)=>{
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
    response.status(404).json({error})

  });
});

router.delete('/:id', cors(), (request, response, next)=>{
  let id = request.params.id
  database('foods').where({id: id}).del()
  .then(()=>{
    response.status(204).json({message:"Food deleted"})
  })
  .catch((error)=>{
    response.status(404).json({error})
  })
})

router.patch('/:id', cors(), (request, response, next)=>{
  let food_params = request.body.food
  let id = request.params.id

  for (let requiredParameter of ['name', 'calories']) {
    if (!food_params[requiredParameter]) {
      return response
      .status(400)
      .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('foods').where({id: id})
  .update({name:food_params.name, calories:food_params.calories})
  .returning('id', 'name', 'calories')
  .then( food_id=>{
    database('foods').where({id: food_id[0]}).select()
    .then( food =>{
      response.status(200).json(food[0])
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  })
  .catch(error => {
    response.status(500).json({ error });
  })
});

router.get('/:id/recipes', cors(), (request, response, next)=>{
  let id = parseInt(request.params.id)
  Food.recipes(id)
  .then((recipes)=>{
    response.status(200).json({recipes})
  })
  .catch((error)=>{
    response.status(500).json({error})
  })

})

router.post('/', cors(), (request, response, next) =>{
  let food_params = request.body.food
  for (let requiredParameter of ['name', 'calories']) {
    if (!food_params[requiredParameter]) {
      return response
      .status(400)
      .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('foods').insert(food_params, 'id')
  .then( food_id=>{
    database('foods').where({id: food_id[0]}).select()
    .then( food =>{
      response.status(200).json(food[0])
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

module.exports = router;
