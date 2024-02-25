import chai from './util/chai.js'
import app from '../../src/server.js'
import pool, { truncateTable } from '../../src/services/mysqlConnectionPool.js'
import * as usersDAO from '../../src/data-access/usersDAO.js'

const { expect } = chai

const USERS = [
  { user_name: 'Alice' },
  { user_name: 'Bob' },
]

describe('Integration Tests for User API', () => {
  describe('GET /api/users', () => {
    beforeEach(async function seedDatabase() {
      await usersDAO.createTable()
      await truncateTable(usersDAO.TABLE_NAME)
      await usersDAO.insertUsers(USERS)
    })

    it('should return all users', (done) => {
      chai
        .request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.equal(2)
          expect(res.body[0]).to.have.property('user_name').eql('Alice')
          expect(res.body[1]).to.have.property('user_name').eql('Bob')
          done()
        })
    })
  })
})
