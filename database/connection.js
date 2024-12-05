import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config({path:'../.env'});


const connection = mysql.createConnection({
    host:process.env.MySQL_host || "autorack.proxy.rlwy.net",
    port: process.env.MySQL_port ||16467,
    database: process.env.MySQL_database ||  "railway ",
    user: process.env.MySQL_user || "root",
    password: process.env.MySQL_password || "NMJztHxpfQNbcMtSJQgpKsWRWvVqsrkM"
}).promise();


export default connection;