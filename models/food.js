const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Food{

  static favorite_foods(){
    return database('foods').select()
    .join('foods', 'foods.id', '=', 'meal_foods.food_id')
    .join('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
    .groupBy('foods.id')
  }
}

module.exports = Food;
