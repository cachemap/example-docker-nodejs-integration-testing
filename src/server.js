import express from 'express';

const app = express();

app.get('/api/users', (req, res) => {
  res.json([{ name: 'Alice' }, { name: 'Bob' }]);
});

export default app;