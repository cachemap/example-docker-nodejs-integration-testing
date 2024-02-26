import chai from './util/chai.js'
import app from '../../src/server.js'
import pool, { truncateTable } from '../../src/services/mysqlConnectionPool.js'
import * as usersDAO from '../../src/data-access/usersDAO.js'

const { expect } = chai

const USERS = [{ user_name: 'Alice' }, { user_name: 'Bob' }]

describe('Integration Tests for User API', () => {
  before(async function createTable() {
    await usersDAO.createTable()
  })

  beforeEach(async function seedDatabase() {
    await truncateTable(usersDAO.TABLE_NAME)
    await usersDAO.insertUsers(USERS)
  })

  describe('GET /api/users', () => {
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

  describe('POST /api/users', () => {
    it('should add a new user', async () => {
      // Create a new user
      const postResponse = await chai.request(app).keepOpen().post('/api/users').send({
        user_name: 'Freddie',
      })
      expect(postResponse).to.have.status(200)

      // Pull updated list of users
      const getResponse = await chai.request(app).get('/api/users')
      expect(getResponse).to.have.status(200)
      expect(getResponse.body).to.be.an('array')
      expect(getResponse.body.length).to.be.equal(3)
      expect(getResponse.body[2]).to.have.property('user_name').eql('Freddie')
    })
  })
})
