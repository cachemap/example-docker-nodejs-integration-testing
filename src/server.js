import express from 'express'
import usersRouter from './routers/usersRouter.js'

const app = express()

app.use('/api/users', usersRouter)

// app.get("/api/teachers", (req, res) => {
//   res.json([{ name: "Mrs. Alice" }, { name: "Mr. Bob" }]);
// });

export default app
