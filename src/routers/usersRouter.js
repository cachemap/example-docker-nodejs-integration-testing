import { Router } from 'express'
import * as usersService from '../services/usersService.js'

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
  res.json(await usersService.getUsers())
})

export default usersRouter
