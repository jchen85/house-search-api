const express = require('express');
const https = require('https');
const kdt = require('kdt'); // kd-tree module

const app = express();

const properties = JSON.parse(require('fs').readFileSync(__dirname + '/data/properties.json', 'utf8'));

// Fix the longitudes on properties list (should be negative, not positive)
properties.forEach((property) => {
  property.long = property.long * -1;
});

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

const searchProperties = (geoCoordObj) => {
  return tree.nearest({lat: geoCoordObj.lat, long: geoCoordObj.long}, properties.length, 20);
};

app.get('/properties', (req, res) => {

  // If no search params specified, return full list
  if (Object.keys(req.query).length === 0) {
    res.json(properties);
  }

  // Search by lat/long
  else if (req.query.lat && req.query.long) {
    res.json(searchProperties({lat: req.query.lat, long: req.query.long}));
  } 

  // Search by string address
  else if (req.query.address) {
    https.get({
      hostname: 'maps.googleapis.com',
      path: `/maps/api/geocode/json?address=${encodeURI(req.query.address)}&key=AIzaSyD-0hEqIgv5GrgsGzCnUymP2saw6FbaCKc`
    }, (results) => {
      var body = '';
      results.on('data', (d) => {
        body += d;
      });
      results.on('end', () => {
        body = JSON.parse(body);
        const geoCoordObj = body.results[0].geometry.location;

        res.json(searchProperties({lat: geoCoordObj.lat, long: geoCoordObj.lng}));
      });
      results.on('error', () => {
        res.end('Error converting input string to geocoordinates. Check format.');
      })
    });
  }
  else {
    res.end('Search query must take the form of /properties?lat=num&long=num or /properties?address=string.')
  }
});

const server = (port) => {
  return app.listen(port, () => {
    console.log('house-search-api server started');
  });
}

module.exports = server;

