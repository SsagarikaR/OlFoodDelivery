import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Food Delivery API',
      version: '1.0.0',
      description: 'API documentation for the Online Food Delivery system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // DO NOT set security globally here, remove it
  },
  apis: ['./dist/routes/*.js'], // Ensure this path is correct based on your environment
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at http://localhost:3000/api-docs');
};

export default swaggerDocs;
