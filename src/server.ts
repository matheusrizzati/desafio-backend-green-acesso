import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import { sequelize } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use('/', routes);

app.use(errorHandler)

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync({ force: false });
    console.log('Database synchronized!');
    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
