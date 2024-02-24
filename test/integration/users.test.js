import chai from './util/chai.js'
import app from '../../src/server.js'

const { expect } = chai

describe('Integration Tests for User API', () => {
  describe('GET /api/users', () => {
    it('should return all users', (done) => {
      chai
        .request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.equal(2)
          expect(res.body[0]).to.have.property('name').eql('Alice')
          expect(res.body[1]).to.have.property('name').eql('Bob')
          done()
        })
    })
  })
})
