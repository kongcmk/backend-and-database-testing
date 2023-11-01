const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Wallet = require('./wallet.js');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isDeactivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

// User.hasOne(Wallet);

module.exports = User;