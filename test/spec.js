const path = require('path');
const superagent = require('superagent');
const expect = require('expect.js');
const server = require(path.join(__dirname, '..', 'index'));

describe('/properties endpoint', function () {
  var testServer;
  beforeEach(() => {
    testServer = server(3000);
  });
  
  afterEach((done) => {
    testServer.close(done);
  });

  it('should return all 10 properties when no params are passed', (done) => {
    superagent.get('http://localhost:3000/properties').end((err, res) => {
      expect(res.body).to.have.length(10);
      done();
    });
  });

  it('should return 1 property when searching for the string address "mountain view"', (done) => {
    superagent.get('http://localhost:3000/properties?address=mountain view').end((err, res) => {
      expect(res.body).to.have.length(1);
      expect(res.body[0][0].city).to.be('Mountain View');
      done();
    });
  });

  it('should return 1 property when searching for the string address "seattle"', (done) => {
    superagent.get('http://localhost:3000/properties?address=seattle').end((err, res) => {
      expect(res.body).to.have.length(1);
      expect(res.body[0][0].city).to.be('Seattle');
      done();
    });
  });

  it('should return 8 properties when searching for lat/long 37.7/-122.3', (done) => {
    superagent.get('http://localhost:3000/properties?lat=37.7&long=-122.3').end((err, res) => {
      expect(res.body).to.have.length(8);
      done();
    });
  });
});
