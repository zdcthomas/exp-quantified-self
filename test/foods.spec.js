const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../app');



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
        database('foods').insert({name:"bannana", calories: 150, id:1}, 'id'),
        database('foods').insert({name:"apple", calories: 200, id:2}, 'id'),
        database('foods').insert({name:"pear", calories: 50, id:3}, 'id')
      ])
    })
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

describe('API Route end points', () => {
  describe('get api/v1/foods', () => {
    it('should return all food entries in the database', (done)=> {
      chai.request(app)
      .get('/api/v1/foods')
      .end( (err, response) => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array')
        response.body.length.should.equal(3)
        response.body[0].should.have.property('name')
        response.body[0].should.have.property('calories')        
        response.body[0].should.have.property('id')
        response.body[0].name.should.equal('bannana')
        response.body[0].calories.should.equal(150)
        done();
      })
    })
  });

  describe('get api/v1/food/:id', ()=>{
    it('should return the specified food entry', (done) =>{
      chai.request(app)
      .get('/api/v1/foods/1')
      .end( (err, response) =>{
        response.should.have.status(200)
        response.should.be.json
        response.body.should.have.property('name')
        response.body.should.have.property('calories')        
        response.body.should.have.property('id')
        response.body.name.should.equal('bannana')
        response.body.calories.should.equal(150)
        response.body.id.should.equal(1)
        done();
      })
    })

    it('should return a 404 if the item cant be found', (done)=>{
      chai.request(app)
      .get('/api/v1/foods/40')
      .end( (err, response) =>{
        response.should.have.status(404)
        done();
      })

    })
  })

  describe('post /api/v1/foods', ()=>{
    it('should create a new food entry in the database', (done)=>{
      let name = "yogurt"
      let calories = 300
      chai.request(app)
      .post('/api/v1/foods')
      .send({
        food:{
          name:name,
          calories:calories
        }
      })
      .end( (err, response)=>{
        response.should.have.status(200)
        response.should.be.json
        response.body.should.have.property('name')
        response.body.should.have.property('id')
        response.body.should.have.property('calories')
        response.body.name.should.equal(name)
        response.body.calories.should.equal(calories)
        done()
      })
    })
    it('should return a 400 error code if the information is invalid', (done)=>{
      let name = "yogurt"
      chai.request(app)
      .post('/api/v1/foods')
      .send({
        food:{
          name:name
        }
      })
      .end( (err, response)=>{
        response.should.have.status(400)
        done()
      })
      
    })
  })
});