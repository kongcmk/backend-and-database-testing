const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user.js');

const Wallet = sequelize.define('Wallet', {
    wallet_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    cryptocurrencies: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    isDeactivatedWallet: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
})

// Wallet.hasOne(User)

module.exports = Wallet