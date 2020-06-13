var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var cors = require('cors')

app.use(cors());
const axios  = require('axios');
const _  = require('lodash');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/db', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// ------------------------------------------------------------------------------------------

const { Client } = require('pg');

// DB initialize
// (async () => {
//   let client;
//   try {

//     client = new Client({
//       user : 'junyup',
//       host : '127.0.0.1',
//       database : 'postgres',
//       password : 'hong082121`',
//       port : 5432,
//     });
//     await client.connect();
//     await client.query(`
//       DROP TABLE Brand;
//       DROP TABLE Convenience;
//       DROP TABLE Food;
//       DROP TABLE RestArea;
//       DROP TABLE highway;
//     `);
//     console.log('[COMPLETE] DROP ALL TABLE');
    
//     await client.query(`
//       CREATE TABLE Highway (hID int, hName varchar(20), gudClssCd int, gudClssNm varchar(5), hdqrCd int, hdqrNm varchar(20), mtnofCd int, mtnofNM varchar(20), primary key(hID));
//       CREATE TABLE RestArea (rID int, rName varchar(20), address varchar(100), telephone varchar(20), cocrPrkgTrcn varchar(20), fscarPrkgTrcn varchar(20), dspnPrkgTrcn varchar(20), hID int, primary key(rID), foreign key(hID) references Highway(hID));
//       CREATE TABLE Food (fName varchar(50), fCost int, recommendMenu varchar(3), seasonMenu varchar(3), bestMenu varchar(3), premiumMenu varchar(3), foodMaterial varchar(300), rID int, foreign key(rID) references RestArea(rID));
//       CREATE TABLE Convenience (cName varchar(20), rID int, cDesc varchar(200), foreign key(rID) references RestArea(rID));
//       CREATE TABLE Brand (bName varchar(20), rID int, bDesc varchar(200), foreign key(rID) references RestArea(rID));
//     `);
//     console.log('[COMPLETE] CREATE ALL TABLE');

//     /* 휴게소+주유소 정보 -> RestArea Table */
//     let req = (await axios.get('http://data.ex.co.kr/openapi/restinfo/hiwaySvarInfoList?key=3357093317&type=json')).data.list;
    
//     /* 고속도로 정보 정보 -> Highway Table */
//     const highwayData = _.uniqBy(req, d => d.routeCd + d.gudClssCd + '');
//     for (let i = 0; i < highwayData.length; i++) {
//       const hid = highwayData[i].routeCd + highwayData[i].gudClssCd + '';
//       await client.query(`INSERT INTO highway (hID, hName, gudClssCd, gudClssNm, hdqrCd, hdqrNm, mtnofCd, mtnofNM) VALUES (${hid*1},'${highwayData[i].routeNm}',${highwayData[i].gudClssCd},'${highwayData[i].gudClssNm}',${highwayData[i].hdqrCd},'${highwayData[i].hdqrNm}',${highwayData[i].mtnofCd}, '${highwayData[i].mtnofNm}');`);
//     }
//     console.log('[COMPLETE] INIT Highway Table');

//     for (let i = 0; i < req.length; i++) {
//       const hid = req[i].routeCd + req[i].gudClssCd + '';
//       await client.query(`INSERT INTO restarea (rID, rName, address, telephone, cocrPrkgTrcn, fscarPrkgTrcn, dspnPrkgTrcn, hID) VALUES (${req[i].svarCd}, '${req[i].svarNm}', '${req[i].svarAddr}', '${req[i].rprsTelNo}', '${req[i].cocrPrkgTrcn}', '${req[i].fscarPrkgTrcn}', '${req[i].dspnPrkgTrcn}', ${hid});`)
//     }
//     console.log('[COMPLETE] INIT Restarea Table');
    
//     // // 휴게소 정보
//     // const restAreaData = _.filter(req, d => d.svarGsstClssNm === '휴게소');
//     // // 주유소 정보
//     // const gasStationData = _.filter(req, d => d.svarGsstClssNm === '주유소');
//     // for (let i = 0; i < restAreaData.length; i++) {
//     //   await client.query(`INSERT INTO restarea (rID, rName, address, telephone, cocrPrkgTrcn, fscarPrkgTrcn, dspnPrkgTrcn, hID) VALUES (${restAreaData[i].svarCd}, '${restAreaData[i].svarNm}', '${restAreaData[i].svarAddr}', '${restAreaData[i].rprsTelNo}', '${restAreaData[i].cocrPrkgTrcn}', '${restAreaData[i].fscarPrkgTrcn}', '${restAreaData[i].dspnPrkgTrcn}', ${restAreaData[i].routeCd});`)
//     // }
    
    
//     /* 휴게시설 정보 -> Convenience Table */
//       // 주유소의 휴게시설
//     let convenienceData = (await axios.get('http://data.ex.co.kr/openapi/restinfo/restOilList?key=3357093317&type=json')).data.list;
//       // 휴게소의 휴게시설
//     for (let i = 1; i <= 10; i++) {
//       convenienceData = convenienceData.concat((await axios.get(`http://data.ex.co.kr/openapi/restinfo/restConvList?key=3357093317&type=json&numOfRows=99&pageNo=${i}`)).data.list);
//     }
//     for (let i = 0; i < convenienceData.length; i++) {
//       // rID === 900458 인 이상한 친구가 있어서 거름
//       if (convenienceData[i].stdRestNm === null) continue;
//       await client.query(`INSERT INTO Convenience (cName, rID, cDesc) VALUES ('${convenienceData[i].psName}', ${convenienceData[i].stdRestCd}, '${convenienceData[i].psDesc !== null ? convenienceData[i].psDesc.replace(/[\'\;]/g, ' ') : "-"}');`);
//     }
//     console.log('[COMPLETE] INIT Convenience Table');

//     /* 음식 정보 -> Food Table */
//     let foodData = [];
//     for (let i = 1; i <= 35; i++) {
//       foodData = foodData.concat((await axios.get(`http://data.ex.co.kr/openapi/restinfo/restBestfoodList?key=test&type=json&numOfRows=99&pageNo=${i}`)).data.list);
//     }
//     for (let i = 0; i < foodData.length; i++) {
//       await client.query(`INSERT INTO Food (fName, fCost, recommendMenu, seasonMenu, bestMenu, premiumMenu, foodMaterial, rID) VALUES ('${foodData[i].foodNm}', ${foodData[i].foodCost}, '${foodData[i].recommendyn}', '${foodData[i].seasonMenu}', '${foodData[i].bestfoodyn}', '${foodData[i].premiumyn}', '${foodData[i].foodMaterial !== null ? foodData[i].foodMaterial.replace(/[\'\;]/g, ' ') : "-"}', ${foodData[i].stdRestCd});`);
//     }
//     console.log('[COMPLETE] INIT Food Table');


//     /* 브랜드 정보 -> Brand Table */
//     let brandData = [];
//     for (let i = 1; i <= 7; i++) {
//       brandData = brandData.concat((await axios.get(`http://data.ex.co.kr/openapi/restinfo/restBrandList?key=test&type=json&numOfRows=99&pageNo=${i}`)).data.list);
//     }
//     for (let i = 0; i < brandData.length; i++) {
//       await client.query(`INSERT INTO Brand (bName, rID, bDesc) VALUES ('${brandData[i].brdName}', ${brandData[i].stdRestCd}, '${brandData[i].brdDesc !== null ? brandData[i].brdDesc.replace(/[\'\;]/g, " ") : "-"}');`);
//     }
//     console.log('[COMPLETE] INIT Brand Table');
    
//     console.log('done');
//   } catch(e) {
//     console.error(e);
//     console.log('error');
//   }
//   // client.end();
// })();



// ------------------------------------------------------------------------------------------




module.exports = app;
