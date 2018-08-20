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

describe('meal requests', ()=>{
  describe('get /api/v1/meals', ()=>{
    it('should return the meal object and all associated foods', (done)=>{
      chai.request(app)
      .get('/api/v1/meals')
      .end( (err, response)=>{
        response.status.should.equal(200)
        response.body.should.be.a('array')
        response.body.length.should.equal(4)
        response.body[0].should.have.property('name','id')
        response.body[0].name.should.equal('Breakfast')
        response.body[0].id.should.equal(1)
        response.body[0].foods.should.be.a('array')
        response.body[0].foods.length.should.equal(2)
        done();
      })
    })
  })
})
