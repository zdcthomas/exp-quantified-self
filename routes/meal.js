var express = require('express');
var router = express.Router();
var cors = require('cors')
const Meal = require('../models/meal')

express().use(cors())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
router.use(cors());

router.get('/', cors(), async(request, response, next)=>{

  let meals = await database('meals').select()
  meals = await Promise.all(meals.map(async(meal)=>{
                let foods = await Meal.foods(meal.id)
                meal['foods'] = foods
                  return meal
                }))
  
  if (meals[0].name) {
    response.status(200).json(meals)
  } else {
    response.status(500).json({error:"internal server error"})
  }
})

router.post('/:meal_id/foods/:food_id', cors(), async(request, response, next)=>{
  let meal_id = request.params.meal_id
  let food_id = request.params.food_id
  let meal = await database('meals').where({id:meal_id}).select()
  let food = await database('foods').where({id:food_id}).select()
  if (meal[0] && food[0]) {
    database('meal_foods').insert({meal_id:meal[0].id, food_id:food[0].id})
    .then( ()=>{
        response.status(201).json({message:`Successfully added ${food[0].name} to ${meal[0].name}`})
    })
    .catch(error=>{
      response.status(500).json({error})
    })
  } else {
    response.status(404).json({error:"Meal or Food not found"})

  }
  
})

module.exports = router;
