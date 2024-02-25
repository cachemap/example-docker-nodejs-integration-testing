import * as usersDAO from '../data-access/usersDAO.js'

export async function getUsers() {
  return usersDAO.getUsers()
}
