"use strict";
// Server configuration and /properties route definition

const express = require('express');
const https = require('https');
const searchProperties = require('./searchProperties');

const app = express();

app.get('/properties', (req, res) => {
  // If no search params specified, return full list
  if (Object.keys(req.query).length === 0) {
    res.json(searchProperties());
  }

  // Search by lat/long
  else if (req.query.lat && req.query.long) {
    res.json(searchProperties({lat: req.query.lat, long: req.query.long}));
  } 

  // Search by string address
  // Uses Google Maps Geocoding API to convert a string address into geocoordinates, then searches properties.json for properties within 20 miles of geocoordinates
  else if (req.query.address) {
    https.get({
      hostname: 'maps.googleapis.com',
      path: `/maps/api/geocode/json?address=${encodeURI(req.query.address)}&key=AIzaSyD-0hEqIgv5GrgsGzCnUymP2saw6FbaCKc` //API key is hardcoded in for convenience of interviewer
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

app.get('*', (req, res) => {
  res.sendStatus(404);
})

const server = (port) => {
  return app.listen(port, () => {
    console.log('house-search-api server started');
  });
}

module.exports = server;
