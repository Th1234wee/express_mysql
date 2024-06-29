import express from 'express';
import { config } from 'dotenv';
import mysql from 'mysql';
config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//connect to sql 
const pool = mysql.createPool({
    connectionLimit : 2,
    host : process.env.db_host,
    port : process.env.db_port,
    user : process.env.db_username,
    password : process.env.db_password,
    database : process.env.db_name
});
pool.getConnection((error,connection) => {
    if(error){
        console.log("Error connect to database");
    }
    console.log("Success connected to database");
    connection.release();
})
//connect to sql
app.get('/getUsers' , (req,res) => {
    //query data from table of current database
    pool.query(`SELECT * FROM tbl_user` , (error,rows) => {
        if(error) console.log("Something went wrong");
        res.send(rows);
    });
});
app.get('/getUserByID/:id' , (req,res) => {
    const { id } = req.params; //2
    pool.query(`SELECT * FROM tbl_user WHERE id = ?`, id ,(error,row) =>{
        if(error) console.log("Something went wrong");
        res.send(row);
    })
})
app.post('/createUser' , (req,res) => {
    const { name , gender , phone } = req.body;
    pool.query(`INSERT INTO tbl_user (name , gender , phone) VALUES (?,?,?)`,[name,gender,phone],(error,result)=>{
        if(error) console.log("Cannot Create User");
        res.json({
            message : result
        })
    })
})


app.get('/',(req,res) => {
    res.send("Route Work");
})


app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});