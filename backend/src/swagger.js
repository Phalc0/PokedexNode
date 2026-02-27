const swaggerJsdoc = require('swagger-jsdoc');  // ← manquant !
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PokéAPI',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);
console.log('Paths détectés:', swaggerSpec.paths);
module.exports = swaggerSpec;