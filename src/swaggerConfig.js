const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wilaya/Commune API",
            version: "1.0.0",
            description: "API documentation for Wilaya and Commune data.",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./controllers/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
