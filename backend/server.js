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
                res.status(400).json({ message: 'Email Already Exists' });
            }else{
                pool.query("INSERT INTO users (name, email_username, phone, password) VALUES ($1, $2, $3, $4)", 
                [name, email, phone, password], (error, results) => {
                    if(error) throw error;
                    res.status(200).json({ message: 'Registered Successfully' });
                })
            }
        })
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

function verifyToken(req, res, next){
    let authHeader = req.headers.authorization;
    if(authHeader == undefined){
        res.status(401).send({ error : "No Token Provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "secret_code", (err, decoded) => {
        if(err){
            res.status(500).send({ error: "Authentication Failed", err });
            console.log(authHeader);
        }
        else {
            next();
        }
    })
}

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      pool.query("SELECT * from users WHERE email_username = $1 and password = $2", [email, password],
      (error, results) => {
        if(!results.rows.length){
            res.status(401).json({ message: 'Invalid Username or Password' });
        }else{
            pool.query("SELECT id,name FROM users WHERE email_username = $1 and password = $2", [email, password],
            (error, results) => {
                if(error) throw error;
                const user = results.rows[0];
                console.log(user);
                let resp = {
                    id : user.id,
                    name : user.name
                };
                const name = user.name;
                const id = user.id;
                const token = jwt.sign(resp, "secret_code", { expiresIn : 86400 });
                
                // res.json({ message: 'Login Successfull', results });
                // res.status(200).send({ auth : true, token : token })
                res.status(200).send({ message: 'Login successful', name , id, auth: true, token: token });
            })
        }
      })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Authentication Failed' });
    }
});

app.post('/users/addrecipe', async (req, res) => {
    const {  recipeName, ingredients, description, image} = req.body.user;
    const { id } = req.body;
    try {
        if(image == undefined){
            pool.query("INSERT INTO recipe(recipe_name, ingredients, description, author_id) VALUES ($1, $2, $3, $4)",
            [recipeName, ingredients, description, id ], (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Recipe Added Successfully' });
            })
        }
        else{
            pool.query("INSERT INTO recipe(recipe_name, ingredients, description, image_file, author_id) VALUES ($1, $2, $3, $4, $5)",
            [recipeName, ingredients, description, image, id ], (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Recipe Added Successfully' });
            })
        }
      
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.get('/users/recipes', verifyToken , async (req, res) => {
    
    try {
      
    } catch (error) {
      
    }
});




app.listen(port, () => console.log(`App listening on port ${port}`));