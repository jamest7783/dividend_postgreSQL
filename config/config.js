require('dotenv').config()
module.exports = {
  development: {
    database: 'dividends_sql',
    dialect: 'postgres'
  },
  test: {
    database: 'sequelize_test',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        require: true
      }
    }
  }
}