const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite_database/simple_wallet.db'
});

module.exports = sequelize;
