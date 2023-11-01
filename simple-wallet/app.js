const express = require('express');
const app = express();
const sequelize = require('./utils/database');
const User = require('./models/user');
const Wallet = require('./models/wallet');
const ExchangeRate = require('./models/exchangeRate');

// connect to database
const databaseConnecting = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

databaseConnecting();

// Middleware
app.use(express.json());

// API
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'))
app.use('/user-wallet', require('./routes/userWalletRoutes'))
app.use('/admin-wallet', require('./routes/adminWalletRoutes'))

// Test server
app.get('/', (req, res) => {
    res.status(200).send("Server is running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
