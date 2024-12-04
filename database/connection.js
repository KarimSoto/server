import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config({path:'../.env'});


const connection = mysql.createConnection({
    host:process.env.MySQL_host,
    port:process.env.MySQL_port,
    database:process.env.MySQL_database,
    user:process.env.MySQL_user,
    password:process.env.MySQL_password
}).promise();


export default connection;