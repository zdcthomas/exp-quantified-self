const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../app');
const Food = require('../models/food')



const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('API Route end points', () => {

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
        database('foods').insert({name:"Bannana", calories: 200, id:1}),
        database('foods').insert({name:"Meatloaf", calories: 800, id:2}),
        database('foods').insert({name:"Pear", calories: 50, id:3}),
        database('foods').insert({name:"Bagel", calories: 400, id:4})
      ])
    })
    .then( ()=>{
      return Promise.all([
        database('meal_foods').insert({meal_id:1, food_id:1}, 'id'),
        database('meal_foods').insert({meal_id:1, food_id:2}, 'id'),
        database('meal_foods').insert({meal_id:2, food_id:2}, 'id'),
        database('meal_foods').insert({meal_id:2, food_id:3}, 'id'),
        database('meal_foods').insert({meal_id:4, food_id:1}, 'id'),
        database('meal_foods').insert({meal_id:4, food_id:4}, 'id'),
      ])
    })
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  describe('favorite_foods class method', ()=>{
    it('should return the most eaten food(s) (foods which appear in the highest number of meals) with the times eaten, and an array of the foods with name an calories', (done)=>{
      Food.favorite_foods()
      .then( (fav_foods)=>{
        fav_foods = fav_foods[1].rows

        fav_foods[0].timeseaten.should.equal('2')
        foods = fav_foods[0].foods
        foods.length.should.equal(2)
        foods[0].should.have.keys('name', 'calories')
        foods[0].should.be.a('object')
        foods[0].name.should.equal('Bannana')
        foods[0].calories.should.equal(200)
        foods[1].name.should.equal('Meatloaf')
        foods[1].calories.should.equal(800)
        
      })
      done();
    })
  });
  
  describe('favorite_foods endpoint', ()=>{
    // it('should return the most eaten food(s) (foods which appear in the highest number of meals) with the times eaten, and an array of the foods with name an calories', (done)=>{
    //   chai.request(app)      
    //   .get('/api/v1/favorite_foods')
    //   .end((err,response)=>{
    //     response.should.have.status(200)
    //     response.should.be.a('array');
    //     response.body[0].timesEaten.should.equal(2)
    //     foods = response.body[0].foods
    //     foods.should.be.a('array')
    //     foods.length.should.equal(2)
    //     foods[0].should.have.keys('name', 'calories')
    //     foods[0].should.be.a('object')
    //     foods[0].name.should.equal('Banana')
    //     foods[0].calories.should.equal(200)
    //     foods[1].name.should.equal('Meatloaf')
    //     foods[1].calories.should.equal(800)
    //     done();
    //   })
    // })
  })
  
});