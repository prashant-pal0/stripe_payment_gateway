import express, { json } from 'express';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import paymentRoutes from './routes/paymentRoutes.js';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

config();

const app = express();
app.use(json());
// const prisma = new PrismaClient();



// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Stripe Payment API',
        version: '1.0.0',
        description: 'API for making payments using Stripe and saving payment information in a PostgreSQL database',
        contact: {
          name: 'Prashant Pal',
        },
        servers: [
          {
            url: 'http://localhost:3000',
          },
        ],
      },
    },
    apis: ['./routes/*.js'], // Path to the API docs
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', serve, setup(swaggerDocs));


// API routes
app.use('/api', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Server Error',
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
