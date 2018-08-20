
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('foods', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('calories');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('meals', (table)=>{
      table.increments('id').primary();
      table.string('name')
    }),
    knex.schema.createTable('meal_foods', (table)=>{
      table.increments('id').primary();
      table.integer('food_id').references('foods.id')
      table.integer('meal_id').references('meals.id')
    })
  ])
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('meal_foods'),
    knex.schema.dropTable('foods'),
    knex.schema.dropTable('meals')
  ]);
};
