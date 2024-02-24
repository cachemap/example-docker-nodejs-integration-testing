import { Router } from 'express'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.json([{ name: 'Alice' }, { name: 'Bob' }])
})

export default usersRouter
