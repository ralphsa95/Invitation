const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const guestRoutes = require('./routes/GuestRoutes');
const adminRoutes = require('./routes/AdminRoutes');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public')); 

app.get('/invite/:invId', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// --- Your routes ---
app.use('/invitation', guestRoutes);
app.use('/admin', adminRoutes);

// --- Swagger setup ---
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Node.js API',
            version: '1.0.0',
            description: 'API documentation for my Node.js app',
        },
        servers: [
            {
                url: 'http://localhost:3000',
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
        },
    },
    // Adjust to match your route files
    apis: [path.join(__dirname, './routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Start the server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
