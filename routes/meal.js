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
    response.status(500).json({error})
  }
})
module.exports = router;
