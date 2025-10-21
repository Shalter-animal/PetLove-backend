const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PetLove API',
      version: '1.0.0',
      description: 'API documentation for PetLove backend',
      contact: {
        name: 'PetLove Team',
        email: 'support@petlove.com'
      }
    },
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints - signup, signin, profile, signout'
      },
      {
        name: 'Authentication',
        description: 'Authentication endpoints (legacy)'
      }
    ],
    servers: [
      {
        url: 'https://petlove-backend-yta1.onrender.com',
        description: 'Production server (Render)'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server (Local)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: []
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

