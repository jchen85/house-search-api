const express = require('express');
const kdt = require('kdt'); // kd-tree module

const app = express();

const properties = JSON.parse(require('fs').readFileSync('./data/properties.json', 'utf8'));

const distance = (a, b) => {
  var lat1 = a.lat,
  lon1 = a.long,
  lat2 = b.lat,
  lon2 = b.long;
  var rad = Math.PI/180;
  var dLat = (lat2-lat1)*rad;
  var dLon = (lon2-lon1)*rad;
  var lat1 = lat1*rad;
  var lat2 = lat2*rad;
  var x = Math.sin(dLat/2);
  var y = Math.sin(dLon/2);
  var a = x*x + y*y * Math.cos(lat1) * Math.cos(lat2); 
  return Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 3959 * 2;
}

const tree = kdt.createKdTree(properties, distance, ['lat', 'long']);

const test = tree.nearest({lat: 37.414323, long: 122.077321}, 10, 20);

console.log(properties.length);
console.log(test);

app.get('/properties', (req, res) => {
  // If no search params specified, return full list
  if (Object.keys(req.query).length === 0) {
    res.json(properties);
  }

  // Search by lat/long
  else if (req.query.lat && req.query.long) {
    const results = tree.nearest({lat: req.query.lat, long: req.query.long}, properties.length, 20);

    res.json(results);
  } 

  // Search by string address
  else if (req.query.address) {
    
  }
  else {
    res.end('Search query must take the form of /properties?lat=num&long=num or /properties?address=string.')
  }

  console.log(req.query.lat);
  console.log(req.query.long);

});

app.listen(3000, () => {
  console.log('house-search-api server started');
});
