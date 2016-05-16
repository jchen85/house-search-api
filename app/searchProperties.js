"use strict";
// searchProperties takes a set of geocoordinates and returns a list of properties within 20 miles

const path = require('path');
const kdt = require('kdt'); // kd-tree module

const properties = JSON.parse(require('fs').readFileSync(path.join(__dirname, '..', 'data/properties.json'), 'utf8'));

// Fix the longitudes on properties list (should be negative, not positive)
properties.forEach((property) => {
  property.long = property.long * -1;
});

// Uses kd-tree module to search properties within 20 miles of given geocoordinates
// kd-tree module documentation: https://github.com/ubilabs/kd-tree-javascript

// Distance function based on Haversine formula
// Multiply result by 3959 * 2 to convert to miles
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

// Creates the kd-tree using the distance function and property data
const tree = kdt.createKdTree(properties, distance, ['lat', 'long']);

const searchProperties = (geoCoordObj) => {
  if (geoCoordObj === undefined) {
    return properties;
  }

  return tree.nearest({lat: geoCoordObj.lat, long: geoCoordObj.long}, properties.length, 20);
}

module.exports = searchProperties;
