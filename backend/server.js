const express = require('express');
const Pool =  require('pg').Pool;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require("express");
const router = Router();

const pool = new Pool({
    user : "anju_jacob",
    host : "192.168.5.9",
    database : "Recipe_Sharing",
    password : "@nju@p9lexu$",
    port : 5432
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/users/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        pool.query("SELECT * FROM users WHERE email_username = $1", [email], (error, results) => {
            if(results.rows.length){
                res.json({ message: 'Email Already Exists' });;
            }else{
                pool.query("INSERT INTO users (name, email_username, phone, password) VALUES ($1, $2, $3, $4)", 
                [name, email, phone, password], (error, results) => {
                    if(error) throw error;
                    res.status(200).json({ message: 'Registered Successfully' });
                })
            }
        })
    } catch (error) {
        res.send("An error Occured", error);
    }
});

app.post('/api/login', async (req, res) => {
    
    try {
      
    } catch (error) {
      
    }
});

app.post('/api/recipes', async (req, res) => {
    
    try {
      
    } catch (error) {
      
    }
});

app.get('/api/recipes', async (req, res) => {
    
    try {
      
    } catch (error) {
      
    }
});




app.listen(port, () => console.log(`App listening on port ${port}`));