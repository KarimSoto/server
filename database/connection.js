import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config({path:'../.env'});


const connection = mysql.createConnection({
    host:"my-mysql",
    port:3306,
    database:"pancakes",
    user:"root",
    password:"ItsukiHorny"
}).promise();


export default connection;