const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT,DB_PORT } = process.env

module.exports = {
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DIALECT,
    DB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}