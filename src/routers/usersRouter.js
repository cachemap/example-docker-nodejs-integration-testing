import { Router, json } from 'express'
import * as usersService from '../services/usersService.js'

const usersRouter = Router()

usersRouter.use(json())

usersRouter.get('/', async (req, res) => {
  res.json(await usersService.getUsers())
})

usersRouter.post('/', async (req, res) => {
  const userName = req.body?.userName
  if (!userName) {
    return res.status(400).end()
  }

  res.json(await usersService.createUser({ user_name: userName }))
})

export default usersRouter
