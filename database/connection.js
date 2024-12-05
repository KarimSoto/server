import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config({path:'../.env'});


const connection = mysql.createConnection({
    host:"autorack.proxy.rlwy.net",
    port:16467,
    database:"railway ",
    user:"root",
    password:"NMJztHxpfQNbcMtSJQgpKsWRWvVqsrkM"
}).promise();


export default connection;