var express = require('express');
var router = express.Router();
var cors = require('cors')
const Food = require('../models/food')
express().use(cors())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
router.use(cors());

router.get('/favorite_foods', cors(), (request, response, next)=>{
  Food.favorite_foods()
  .then((fav_foods)=>{
    favorites = fav_foods[1].rows
    response.status(200).json(favorites)
  })
  .catch((error)=>{
    response.status(500).json({error})
  })
});
module.exports = router;
