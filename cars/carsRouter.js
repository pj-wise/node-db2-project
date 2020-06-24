const express = require('express');
const router = express.Router();

const db = require('../data/dbConfig.js');

router.get('/', (req, res) => {
  db('cars')
    .then(cars => {
      res.status(200).json(cars);
    })
    .catch(() => {
      res
        .status(500).json({ message: 'Could not retrieve the list of cars' });
    });
});


router.get('/:id', (req, res) => {
  db('cars')
    .where({id: req.params.id})
    .first()
    .then(car => {
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    })
    .catch(error => {
      res.status(500).json({errorMessage:'Could not retrieve car data'});
    });
});

router.post('/', (req, res) => {
  const {vin, make, model, mileage} = req.body;
  // validate
  if(!vin || !make || !model || !mileage){
    res.status(400).json({errorMessage:'Please provide a vin, make, model, and mileage.'})
  }
  if(typeof vin !== 'string' || typeof make !== 'string' || typeof model !== 'string' ){
    res.status(400).json({errorMessage:'vin, make, and model need to be a string'})
  }
  if(typeof mileage !== 'number'){
    res.status(400).json({errorMessage:'mileage needs to be a number'})
  }
  
  db('cars')
    .insert(req.body, 'id')
    .then(ids => {
      res.status(200).json(ids);
    })
    .catch(error => {
      if(error.errno === 19){
        res.status(500).json({errorMessage:'The vin field needs to be unique'});
      } else {
        res.status(500).json({errorMessage:'There was an error adding the car'});
      }
    });
});

module.exports = router;