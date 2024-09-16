// swagger/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dining Services API',
      version: '1.0.0',
      description: 'API documentation for the Dining Services App',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        Menu: {
          type: 'object',
          required: ['name', 'nutritionalInfo', 'ingredients', 'date'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated ID of the menu',
            },
            name: {
              type: 'string',
              description: 'Name of the menu item',
            },
            nutritionalInfo: {
              type: 'string',
              description: 'Nutritional information',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of ingredients',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of the menu',
            },
          },
        },
  
        DietaryPreference: {
          type: 'object',
          required: ['userId', 'preferences', 'restrictions'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            preferences: {
              type: 'string',
              description: 'User dietary preferences',
            },
            restrictions: {
              type: 'string',
              description: 'User dietary restrictions',
            },
          },
        },
        MealCredits: {
          type: 'object',
          required: ['userId', 'Accounts'],
          properties: {
            userId: {
              type: 'string',
              description: 'User ID associated with the accounts',
            },
            Accounts: {
              type: 'array',
              items: {
                type: 'object',
                required: ['accountName', 'balance', 'transactions'],
                properties: {
                  accountName: {
                    type: 'string',
                    description: 'Name of the account',
                  },
                  balance: {
                    type: 'number',
                    format: 'decimal',
                    description: 'Current balance of the account',
                  },
                  transactions: {
                    type: 'object',
                    required: ['moneyIn', 'moneyOut'],
                    properties: {
                      moneyIn: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['amount', 'date'],
                          properties: {
                            amount: {
                              type: 'number',
                              format: 'decimal',
                              description: 'Amount of money added',
                            },
                            date: {
                              type: 'string',
                              format: 'date-time',
                              description: 'Date the money was added',
                            }
                          }
                        },
                        description: 'List of transactions for money coming in',
                      },
                      moneyOut: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['amount', 'date'],
                          properties: {
                            amount: {
                              type: 'number',
                              format: 'decimal',
                              description: 'Amount of money withdrawn',
                            },
                            date: {
                              type: 'string',
                              format: 'date-time',
                              description: 'Date the money was withdrawn',
                            }
                          }
                        },
                        description: 'List of transactions for money going out',
                      }
                    }
                  }
                }
              },
              description: 'List of user accounts with balances and transaction details'
            }
          }
        }
        
        // Define other schemas: MealCredit, Reservation, Feedback

      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
