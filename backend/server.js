const express = require('express');
const Pool =  require('pg').Pool;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { Router } = require("express");
const { async } = require('rxjs');
// const router = Router();

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
                res.status(400).json({ message: 'User Already Exists' });
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
    // let token = authHeader.split(" ")[1];
    jwt.verify(authHeader, "secret_code", (err, decoded) => {
        if(err){
            res.status(500).send({ error: "Authentication Failed", err });
            // console.log('failed',authHeader);
        }
        else {
            next();
            // console.log('success',authHeader);
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

app.post('/users/addrecipe', verifyToken, async (req, res) => {
    const {  recipeName, ingredients, description } = req.body.recipe;
    const { id } = req.body;
    try {
            pool.query("INSERT INTO recipe(recipe_name, ingredients, description, author_id) VALUES ($1, $2, $3, $4)",
            [recipeName, ingredients, description, id ], (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Recipe Added Successfully' });
            })
      
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.get('/recipes/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    try {
      pool.query('SELECT u.name, r.id, r.recipe_name, r.ingredients, r.description, r.created_at FROM users AS u JOIN recipe AS r ON u.id = r.author_id ; ', (error, results) => {
        if(error) throw error;
        const result = results.rows;
        pool.query('SELECT recipe_id FROM bookmark WHERE user_id = $1', [userId],
        (error, results) => {
            if(error) throw error;
            const recipeIDs = results.rows;
            res.status(200).json({ message : 'Retrieved Successfully', result,recipeIDs });
        })
        
      });
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.get('/recipes/recipedetail/:id', verifyToken, async (req, res) => {
    const recipeId = req.params.id;
    try{
        pool.query('SELECT * FROM recipe WHERE id = $1', [recipeId], (error, results) => {
            if (error) {
                console.error('Error retrieving recipe:', error);
                res.status(500).json({ message: 'Internal server error' });
                console.log(failed);
              } else {
                const result = results.rows;
                res.status(200).json({ message : 'Retrieved', result });
            }

        })
    }
    catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.get('/recipes/search/:term', verifyToken, async (req, res) => {
    const searchTerm = req.params.term;
    try {
        pool.query("SELECT u.name, r.id, r.recipe_name, r.ingredients, r.description, r.created_at FROM users AS u JOIN recipe AS r ON u.id = r.author_id", (error, results) => {
            if (error) {
                console.error('Error retrieving recipes:', error);
                // res.status(500).json({ message: 'Internal server error' });
              } else {
                const result = results.rows;
                const filteredResult = result.filter(recipe =>
                    recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                res.status(200).json({ message : 'Retrieved', filteredResult });
              }
        })
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.post('/recipes/addComment', verifyToken, async (req, res) => {
    const comment = req.body.comment.comments;
    const id  = req.body.id;
    const recipeId = req.body.recipe_id;
    try {
        pool.query("INSERT INTO comments (comment, user_id, recipe_id) VALUES ($1, $2, $3)",
            [comment, id, recipeId], (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Comment Added Successfully' });
            })
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.get('/recipes/comments/:id', verifyToken, async (req, res) => {
    const recipeId = req.params.id;
    try{
        pool.query('SELECT u.name, c.comment, c.created_at FROM users AS u JOIN comments AS c ON u.id = c.user_id where c.recipe_id = $1; ', 
        [recipeId], (error, results) => {
            if (error) {
                console.error('Error retrieving comments', error);
                res.status(500).json({ message: 'Internal server error' });
                console.log(failed);
              } else {
                const result = results.rows;
                res.status(200).json({ message : 'Retrieved', result });
            }

        })
    }
    catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.get('/users/myrecipes/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    try{
        pool.query('SELECT r.id, r.recipe_name, r.ingredients, r.description, r.created_at FROM users AS u JOIN recipe AS r ON u.id = r.author_id WHERE r.author_id = $1', 
        [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving comments', error);
                res.status(500).json({ message: 'Internal server error' });
                console.log(failed);
              } else {
                const result = results.rows;
                res.status(200).json({ message : 'Retrieved', result });
            }

        })
    }
    catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.post('/recipes/bookmark', verifyToken, async (req,res) => {
    const userId = req.body.user_id;
    const recipeId = req.body.recipe_id;
    try{
        pool.query("INSERT INTO bookmark (user_id, recipe_id) VALUES ($1, $2)", [userId, recipeId],
        (error, results) => {
            if(error) throw error;
            res.status(200).json({ message: 'Bookmarked Successfully' });
        });
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.delete('/recipes/unmark', verifyToken, async (req, res) => {
    const userId = req.query.user_id;
    const recipeId = req.query.recipe_id;
    try{
        pool.query("DELETE FROM bookmark WHERE user_id = $1 AND recipe_id = $2", [userId, recipeId],
        (error, results) => {
            if(error) throw error;
            res.status(200).json({ message: 'Bookmark Deleted Successfully' });
        })
    } catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.delete('/myrecipes/delete', verifyToken, async (req, res) => {
    const recipeId = req.query.recipe_id;
    try{
        pool.query("SELECT * FROM comments AS c JOIN recipe AS r ON c.recipe_id = r.id WHERE c.recipe_id = $1", 
        [recipeId], (error, results) => {
            if(results.rows.length != 0){
                pool.query("DELETE FROM comments WHERE recipe_id = $1", [recipeId], (error, results) => {
                    if(error) throw error;
                })
            }
            pool.query("DELETE FROM recipe WHERE id = $1", [recipeId],
            (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Recipe Deleted Successfully' });
            })
        })
    } catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.get('/users/bookmark/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    try{
        pool.query('SELECT r.id, r.recipe_name, r.ingredients, r.description, r.created_at FROM recipe AS r JOIN bookmark AS b ON r.id = b.recipe_id WHERE b.user_id = $1', [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving bookmarked recipe:', error);
                res.status(500).json({ message: 'Internal server error' });
                console.log(failed);
              } else {
                const result = results.rows;
                res.status(200).json({ message : 'Retrieved', result });
            }

        })
    }
    catch (error){
        res.json({message : 'An error Occured', error});
    }
});

app.post('/users/editrecipe', verifyToken, async (req, res) => {
    const {  recipeName, ingredients, description } = req.body.recipe;
    const { id } = req.body;
    try {
            pool.query("UPDATE recipe SET recipe_name = $1, ingredients = $2, description = $3 WHERE id = $4",
            [recipeName, ingredients, description, id ], (error, results) => {
                if(error) throw error;
                res.status(200).json({ message: 'Recipe Updated Successfully' });
            })
    } catch (error) {
        res.json({message : 'An error Occured', error});
    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));