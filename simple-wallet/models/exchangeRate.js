const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ExchangeRate = sequelize.define('ExchangeRate', {
    fromCurrency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    toCurrency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rate: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        default: Date.now(),
    }
})


module.exports = ExchangeRate