const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HopAlong API',
      version: '1.0.0',
      description: 'Travel Companion Platform API for IIT Roorkee Students',
      contact: {
        name: 'HopAlong Team',
        email: 'support@hopalong.dev',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://alongtraveling.onrender.com/api'
            : 'http://localhost:5000/api',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email (must be IITR domain)',
              example: 'john.doe@iitr.ac.in',
            },
            branch: {
              type: 'string',
              description: 'Branch of study',
              example: 'CSE',
            },
            year: {
              type: 'string',
              enum: [
                '',
                '1st Year',
                '2nd Year',
                '3rd Year',
                '4th Year',
                '5th Year',
                'Alumni',
              ],
              description: 'Year of study',
            },
            bio: {
              type: 'string',
              description: 'User biography',
              example: 'Travel enthusiast looking for companions',
            },
            avatar: {
              type: 'string',
              description: 'User avatar initials',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
          },
        },
        Trip: {
          type: 'object',
          required: [
            'title',
            'destination',
            'startDate',
            'endDate',
            'budget',
            'mode',
            'type',
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'Trip ID',
            },
            title: {
              type: 'string',
              description: 'Trip title',
              example: 'Manali Adventure Trip',
            },
            destination: {
              type: 'string',
              description: 'Trip destination',
              example: 'Manali, Himachal Pradesh',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Trip start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Trip end date',
            },
            budget: {
              type: 'number',
              description: 'Estimated budget per person',
              example: 5000,
            },
            mode: {
              type: 'string',
              enum: ['Bus', 'Train', 'Car', 'Flight'],
              description: 'Travel mode',
            },
            type: {
              type: 'string',
              enum: ['Adventure', 'Leisure', 'Cultural', 'Educational'],
              description: 'Trip type',
            },
            description: {
              type: 'string',
              description: 'Trip description',
              example:
                'An exciting adventure trip to Manali with trekking and sightseeing',
            },
            organizer: {
              type: 'string',
              description: 'Organizer user ID',
            },
            participants: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of participant user IDs',
            },
            maxParticipants: {
              type: 'number',
              description: 'Maximum number of participants',
              example: 6,
            },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'completed'],
              default: 'upcoming',
              description: 'Trip status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Trip creation date',
            },
          },
        },
        JoinRequest: {
          type: 'object',
          required: ['trip', 'user'],
          properties: {
            _id: {
              type: 'string',
              description: 'Request ID',
            },
            trip: {
              type: 'string',
              description: 'Trip ID',
            },
            user: {
              type: 'string',
              description: 'User ID',
            },
            message: {
              type: 'string',
              description: 'Request message',
              example: 'I would love to join this trip!',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              default: 'pending',
              description: 'Request status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Request creation date',
            },
          },
        },
        Message: {
          type: 'object',
          required: ['trip', 'sender', 'content'],
          properties: {
            _id: {
              type: 'string',
              description: 'Message ID',
            },
            trip: {
              type: 'string',
              description: 'Trip ID',
            },
            sender: {
              type: 'string',
              description: 'Sender user ID',
            },
            content: {
              type: 'string',
              description: 'Message content',
              example: 'Hey everyone! Excited for the trip!',
            },
            readBy: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of user IDs who have read the message',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message creation date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name',
                  },
                  message: {
                    type: 'string',
                    description: 'Error message',
                  },
                },
              },
              description: 'Validation errors array',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js', // Path to the API docs
    './controllers/*.js', // Path to controllers
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
