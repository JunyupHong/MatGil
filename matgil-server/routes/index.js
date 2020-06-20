var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const _ = require('lodash');

const client = new Client({
        user : 'junyup',
        host : '127.0.0.1',
        database : 'postgres',
        port : 5432,
      });

(async () => {
  await client.connect();
})();


// 전체 고속도로 데이터
router.get('/highway', async (req, res) => {  
  const result = (await client.query(`SELECT * from highway`)).rows;
  console.log(`[QUERY] SELECT * FROM highway`);
  console.log(`  [RESULT] 전체 고속도로 데이터: ${result.length} 개`);
  res.send(result);
});

// 선택된 고속도로 데이터
router.get('/highway/:hid', async (req, res) => {
  const result = (await client.query(`SELECT * from highway where hid=${req.params.hid}`)).rows;
  console.log(`[QUERY] SELECT * from highway where hid=${req.params.hid}`);
  console.log(`  [RESULT] 선택된 고속도로 데이터: ${result.length} 개`);
  res.send(result);
});

// 고속도로 상의 휴게소 리스트 및 정보
router.get('/restarea/:hid', async (req, res) => {
  const all = (await client.query(`SELECT *
    FROM RestArea natural full outer join food 
    WHERE restarea.hID=${req.params.hid}
    order by rid asc;`)).rows;
  
  console.log(`[QUERY] SELECT * FROM RestArea natural full outer join food WHERE restarea.hID=${req.params.hid} order by rid asc;`);
  console.log(`  [RESULT] 선택된 고속도로 상의 휴게소 리스트 및 정보: ${all.length} 개`);
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


router.get('/restarea/info/:rid', async (req, res) => {
  const all = (await client.query(`
    SELECT Restarea.rid, rName,
      fid, fname, fcost,
      null ::integer as bid, null as bname, null as bdesc,
      null ::integer as cid, null as cname, null as cdesc
    FROM Food natural join RestArea
    WHERE Food.rID=${req.params.rid}
    union
    SELECT Restarea.rid, rName,
      null, null, null,
      bid, bname, bdesc,
      null, null, null
    FROM Brand natural join RestArea
    WHERE brand.rID=${req.params.rid}
    union
    SELECT Restarea.rid, rname,
      null, null, null,
      null, null, null,
      cid, cname, cdesc
    FROM Convenience natural join RestArea
    WHERE Convenience.rID=${req.params.rid}
  `)).rows;

  console.log(`SELECT Restarea.rid, rName, fid, fname, fcost, null ::integer as bid, null as bname, null as bdesc, null ::integer as cid, null as cname, null as cdesc FROM Food natural join RestArea WHERE Food.rID=${req.params.rid}
    union
    SELECT Restarea.rid, rName, null, null, null, bid, bname, bdesc, null, null, null FROM Brand natural join RestArea WHERE brand.rID=${req.params.rid}
    union
    SELECT Restarea.rid, rname, null, null, null, null, null, null, cid, cname, cdesc FROM Convenience natural join RestArea WHERE Convenience.rID=${req.params.rid}`);
  console.log(`  [RESULT] 선택된 휴게소 정보 (음식, 브랜드, 편의시설): ${all.length} 개`);

  const result = {
    restAreaData: {},
    food: [],
    brand: [],
    convenience: [],
  };

  _.forEach(all, (data, i) => {
    if (i === 0) {
      result.restAreaData.rid = data.rid;
      result.restAreaData.rname = data.rname;
    }
    if (data.fname) {
      result.food.push({
        fid: data.fid,
        fname: data.fname,
        fcost: data.fcost,
      });
    }
    if (data.bname) result.brand.push({
      bid: data.bid,
      bname: data.bname,
      bdesc: data.bdesc
    });
    if (data.cname) result.convenience.push({
      cid: data.cid,
      cname: data.cname,
      cdesc: data.cdesc
    });
  });
  res.send(result);
});

router.get('/food/:fid', async (req, res) => {
  const result = (await client.query(`SELECT * from FOOD WHERE fid=${req.params.fid}`)).rows;
  
  console.log(`[QUERY] SELECT * FROM RestArea natural full outer join food WHERE restarea.hID=${req.params.hid} order by rid asc;`);
  console.log(`  [RESULT] 선택된 음식 정보: ${ result.length } 개`);
  console.log(result[0]);
  res.send(result[0]);
});

module.exports = router;
