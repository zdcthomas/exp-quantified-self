const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Food{
  
  static favorite_foods(){

    return database.raw("CREATE OR REPLACE VIEW count AS "
    +"SELECT foods.name AS name, foods.calories AS calories, foods.id as id, count(meals.id) AS timesEaten "
    +"FROM foods "
    +"INNER JOIN meal_foods ON foods.id = meal_foods.food_id "
    +"INNER JOIN meals ON meals.id = meal_foods.meal_id "
    +"GROUP BY foods.id; "
    +"SELECT json_agg(json_build_object('name',count.name, 'calories', count.calories)) as foods, timesEaten FROM count "
    +"GROUP BY timesEaten "
    +"ORDER BY timesEaten DESC;"
  )
  }
}

module.exports = Food;
