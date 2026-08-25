import express from 'express';
import cors from 'cors';
import { eventRoutes } from '..//infrastructure/http/routes/event.routes';
import { startTicketExpirationJob } from '../infrastructure/jobs/ticket-expiration.cron';

const app = express();

app.use(cors());
app.use(express.json());

// Monta todas as rotas de eventos sob o prefixo /api
app.use('/api', eventRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);

  startTicketExpirationJob();
});