const mysql = require('mysql2');
const config = require('./../configurations/config.js');


const createPool = () => {
    let pool = mysql.createPool({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0
    });

    return pool;
}

const getDBConnection = () => {

    const promisePool = createPool().promise();    
    return promisePool;
}

const testDBConnection = async () => {
    const promisePool = createPool().promise();
    // query database using promises
    const result = await promisePool.query("SELECT 1");

    if (result) {
        console.log("DB connected successfully");
        return true;
    } else {
        console.log("DB connection failed");
        return false;
    }
}

module.exports = {
    getDBConnection,
    createPool,
    testDBConnection
}