import { app } from './app';

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}!`); // eslint-disable-line no-console
});
