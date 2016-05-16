# house-search-api
Returns a list of houses within 20 miles of the search parameters. Can accept lat/long geocoordinates or a string address.

### Usage
Clone repo, then start server by running `npm start`. Unit tests can be run with `npm run test`.

### Endpoints
One endpoint is available for use, /properties

| Action        | Request format           | Return  |
| --------------------------- |-------------| -----|
| Retrieve all properties      | GET request to /properties | Array of property objects |
| Retrieve properties within 20 miles of geocoordinates | GET request to /properties?lat=`number`&long=`number`|   Array of tuples, tuple[0] is property object, tuple[1] is distance between property and input |
| Retrieve properties within 20 miles of string address | GET request to /properties?address=`string`      |Same as geocoordinates search|

### Libraries Used
[node-kdt](https://github.com/luk-/node-kdt) - kd-tree implementation in Javascript. Used to store properties and perform distance-restricted searches by geocoordinates
