require('dotenv').config()
module.exports = {
  development: {
    database: '<Your Dev Database>',
    dialect: 'postgres'
  },
  test: {
    database: '<Your Database Test Name>',
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