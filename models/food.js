const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');


class Food{
  
  static favorite_foods(){

    return database.raw("CREATE OR REPLACE VIEW count AS "
      +"SELECT foods.name AS name, foods.calories AS calories, foods.id as id, count(meals.id) AS timesEaten, array_agg(meals.name) as mealswheneaten "
      +"FROM foods "
      +"INNER JOIN meal_foods ON foods.id = meal_foods.food_id "
      +"INNER JOIN meals ON meals.id = meal_foods.meal_id "
      +"GROUP BY foods.id; "
      +"SELECT json_agg(json_build_object('name',count.name, 'calories', count.calories, 'mealswheneaten', count.mealswheneaten)) as foods, timesEaten FROM count "
      +"GROUP BY timesEaten "
      +"ORDER BY timesEaten DESC;"
    )
  }

  static async recipes(food_id){ 

    let food = await database('foods')
                    .select()
                    .where({id: food_id})
    debugger
    let returned = await fetch(`http://api.yummly.com/v1/api/recipes?q=${food[0].name}&_app_id=4738fae6&_app_key=3aa1603ee04a3bc89f372c0d7a3992da`)
    debugger
    let recipes = await returned.json()
    debugger
    return recipes.matches
    debugger
   
  }
}

module.exports = Food;
