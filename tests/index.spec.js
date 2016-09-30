require('babel-register');

var Twisto = require('../src');

var twst = new Twisto();
twst.getLines()
  .then((res) => {

    return twst.getBusStopsByLine(res[1].code, 'A');
  })
  .then((res) => {

    return twst.getNextBusesByBusStop(res[1].reference);
  })
  .then((res) => {

    console.log(require('util').inspect(res, { depth: null }));
  })
  .catch((err) => {

    console.error('Error:', err);
  });
