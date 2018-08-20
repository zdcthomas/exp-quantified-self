exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('meal_foods').del()
  .then( ()=> knex('foods').del())
  .then( ()=> knex('meals').del())
  .then( ()=>{
    return Promise.all([
      knex('meals').insert({id: 1, name: 'Breakfast'}),
      knex('meals').insert({id: 2, name: 'Snack'}),
      knex('meals').insert({id: 3, name: 'Lunch'}),
      knex('meals').insert({id: 4, name: 'Dinner'}),
    ])
  })
  .catch( (error) => console.log(`Error seeding data: ${error}`))
};
