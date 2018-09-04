const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../app');
const Food = require('../models/food')



const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('yummly api call', ()=>{
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then( ()=>{
      return Promise.all([
        database('foods').del()
      ])
    })
    .then( () => {
      return Promise.all([
        database('foods').insert({name:"bannana", calories: 150, id: 1}),
      ])
    })
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  describe('api/v1/foods/:id/recipes', ()=>{
    it('should return an object with a recipes array, containing obejects with the keys name and url', (done)=>{
      chai.request(app)
      .get('/api/v1/foods/1/recipes')
      .end( (err, response) => {
        response.should.have.status(200)
        response.body.recipes.should.be.a('array')
        response.body.recipes[0].should.have.keys('name', 'url')
        done();
      })
    })
  })

})