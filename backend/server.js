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
    database : "student_node",
    password : "@nju@p9lexu$",
    port : 5432
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/api/register', async (req, res) => {
    
    try {
      
    } catch (error) {
      
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