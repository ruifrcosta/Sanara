import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1', router);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
}); 