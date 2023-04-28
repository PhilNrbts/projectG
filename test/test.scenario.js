const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);



describe('Scenario tests', function() { // Use a regular function instead of an arrow function
  this.timeout(5000); // Increase the timeout for all tests in this describe block
  let userId;
  let gameId;
  let gameToken;

  // Generate unique username and email
  const timestamp = Date.now();
  const testUsername = `testUser${timestamp}`;
  const testEmail = `test${timestamp}@example.com`;

  it('should not allow access to restricted resources for unregistered visitor', (done) => {
    chai
      .request(app)
      .post('/api/games/create')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should register a new user', (done) => {
    console.log(`[${new Date().toISOString()}] Starting registration test`);
    chai
      .request(app)
      .post('/api/users/register')
      .send({ username: testUsername, email: testEmail, password: 'password123' })
      .end((err, res) => {
        console.log(`[${new Date().toISOString()}] Registration test finished`);
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
        const user = res.body.user;
        expect(user).to.have.property('userId');
        userId = user.userId;
        done();
      });
  });

  it('should log in the user', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({ email: testEmail, password: 'password123' }) // Remove the username field
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // 200 status code for successful login
        expect(res.body).to.have.property('token');
        gameToken = res.body.token;
        done();
      });
  });

  // ... other test cases ...

  after((done) => {
    server.close(done);
  });
});
