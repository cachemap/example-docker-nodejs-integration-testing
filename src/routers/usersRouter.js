import { Router, json } from 'express'
import * as usersService from '../services/usersService.js'

const usersRouter = Router()

usersRouter.use(json())

usersRouter.get('/', async (req, res) => {
  res.json(await usersService.getUsers())
})

usersRouter.post('/', async (req, res) => {
  const userName = req.body?.user_name
  if (!userName) {
    return res.status(400).send()
  }

  res.json(await usersService.createUser(req.body))
})

export default usersRouter
