import { dataSource } from '../typeorm';
import { app } from './app';

const port = process.env.PORT || 3333;

dataSource.then(data => {
  if (data.isInitialized) {
    app.listen(port, () => {
      console.log(`🚀 Server started on port ${port}!`);// eslint-disable-line
    });
  }
});
