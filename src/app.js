const express = require('express');
const wilayaController = require("./controllers/wilayaController")
const communeController = require("./controllers/communeController")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const fs = require("fs");

const app = express();

// Save openapi.json file
fs.writeFileSync("./openapi.json", JSON.stringify(swaggerSpec, null, 2));

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        url: "/openapi.json", // Link to downloadable OpenAPI file
    }
}));

app.get('/api/v1/getWilaya', wilayaController.getWilaya);
app.get('/api/v1/getCommune', communeController.getCommune);

module.exports = app;