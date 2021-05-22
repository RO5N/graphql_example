import express from 'express';

export default express.Router().get('/', (_, res) => {
  res.status(200).json({
    message: 'API OK',
  });
});
