const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../app');
const meal = require('../models/meal')



const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

before((done) => {
database.migrate.latest()
  .then(() => done())
  .catch(error => {
    throw error;
  });
});

beforeEach((done) => {
  database.seed.run()
  .then( () => {
    return Promise.all([
      database('foods').insert({name:"bannana", calories: 150, id:1}),
      database('foods').insert({name:"apple", calories: 200, id:2}),
      database('foods').insert({name:"pear", calories: 50, id:3})
    ])
  })
  .then( ()=>{
    return Promise.all([
      database('meal_foods').insert({meal_id:1, food_id:1}, 'id'),
      database('meal_foods').insert({meal_id:1, food_id:2}, 'id'),
      database('meal_foods').insert({meal_id:2, food_id:2}, 'id'),
      database('meal_foods').insert({meal_id:2, food_id:3}, 'id'),
      database('meal_foods').insert({meal_id:4, food_id:1}, 'id'),
      database('meal_foods').insert({meal_id:4, food_id:2}, 'id'),
    ])
  })
  .then(() => done())
  .catch(error => {
    throw error;
  });
});

describe('meals', ()=>{
  describe('foods method', ()=>{
    it('should return all associated foods for a meal', (done)=>{
      let returnedFoods = meal.foods(1)
      returnedFoods.should.be('array')
      returnedFoods[0].should.have.property('name','calories')
      returnedFoods[0].name.should.be('bannana')
      returnedFoods[0].calories.should.be(150)
    })
  })
})

