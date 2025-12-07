const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Portfolio = require('./portfolio.model')(sequelize);
const PortfolioLike = require('./portfolio-like.model')(sequelize);

const db = {
  sequelize,
  Sequelize,
  Portfolio,
  PortfolioLike
};

module.exports = db;
