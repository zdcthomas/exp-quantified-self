
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('meal_foods').del()
  .then( ()=> knex('foods').del())
  .then( ()=> knex('meals').del())
  .then( ()=>{
      knex('table_name').insert([
        {id: 1, name: 'Breakfast'},
        {id: 2, name: 'Snack'},
        {id: 3, name: 'Lunch'},
        {id: 4, name: 'Dinner'}
      ]);
  })
  .catch( (error) => console.log(`Error seeding data: ${error}`))
};
