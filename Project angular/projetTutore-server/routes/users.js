var express = require('express');
var dbMongo = require('../public/javascripts/dbMongo');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  /*setTimeout(() => {

    let jsonResponse = {
      "handsetCards": [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 2, rows: 1 },
        { title: 'Card 3', cols: 2, rows: 1 },
        { title: 'Card 4', cols: 2, rows: 1 }
      ],
      "webCards": [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ]
    };
    res.json(jsonResponse);
    
  }, 3000);*/

  dbMongo.writeData().then(response =>{
    res.json(response);
    console.log('ok');
  }).catch(error =>{
    res.status(500).json({});
  });
  
});

module.exports = router;
