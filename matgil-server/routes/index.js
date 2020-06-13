var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const _ = require('lodash');

const client = new Client({
        user : 'junyup',
        host : '127.0.0.1',
        database : 'postgres',
        password : 'hong082121`',
        port : 5432,
      });

(async () => {
  await client.connect();
})();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/food', function(req, res, next) {
  
});

router.get('/highway', async (req, res) => {
  
  const result = (await client.query(`SELECT * from highway`)).rows;
  res.send(result);
});

router.get('/highway/:hid', async (req, res) => {
  const result = (await client.query(`SELECT * from highway where hid=${req.params.hid}`)).rows;
  res.send(result);
});
router.get('/restarea/:hid', async (req, res) => {
  // const result = (await client.query(`SELECT * FROM restarea WHERE hID=${req.params.hid}`)).rows;
  const all = (await client.query(`SELECT *
    FROM RestArea natural join Food 
    WHERE restarea.hID=${req.params.hid};`)).rows;
  const result = [];
  all.forEach(ele => {
    const idx = _.findIndex(result, r => r.rid === ele.rid);
    if (idx === -1) {
      result.push(Object.assign(_.omit(ele, 'fname'), {'fname': [ele.fname]}));
    } else {
      result[idx].fname.push(ele.fname);
    }
  });
  res.send(result);
});

// router.get('/restarea/:hid', async (req, res) => {
//   const result = (await client.query(`SELECT distinct *
//     FROM RestArea, Food, highway
//     WHERE HIGHWAY.hID=${req.params.hid} and food.bestmenu='Y' and highway.gudclsscd = ${req.params.gudclsscd}
//     order by rname asc;`)).rows;
//   res.send(result);
// });



module.exports = router;
