const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Meal{

  static foods(meal_id){
    return database('meals').select()
      .where('meals.id', meal_id)
      .join('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
      .join('foods', 'foods.id', '=', 'meal_foods.food_id')
  }
}

module.exports = Meal;
