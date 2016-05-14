const express = require('express');
const rbush = require('rbush');

const app = express();
const tree = rbush(9);

app.listen(3000, function () {
  console.log('house-search-api server started');
});