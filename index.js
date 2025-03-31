import express from 'express'
import dotenv from 'dotenv'
import client from './db.js';
import cors from 'cors';

import { body, param, validationResult } from 'express-validator';


dotenv.config();

const PORT = process.env.PORT || 5000;

const app= express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res) => {
    try {
        const result = await client.query('select * from posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message)
    }
})
app.get('/posts/:id',async(req,res) => {
    const {id} = req.params;
    try {
        const result = await client.query('select * from posts where id= $1',[id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// Utility function for error responses
const handleErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// app.get('/',async (req,res) => {
//     try {
//          res.json({message: 'server is running'});
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })


app.put(
    "/posts/:id",
    [
        param("id").isInt().withMessage("Post ID must be an integer"),
        body("author").trim().notEmpty().withMessage("Author is required"),
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content").trim().notEmpty().withMessage("Content is required"),
        body("cover").trim().notEmpty().withMessage("Cover URL is required"),
    ],
    handleErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { author, title, content, cover } = req.body;

            const result = await client.query(
                "UPDATE posts SET author = $1, title = $2, content = $3, cover = $4 WHERE id = $5 RETURNING *",
                [author, title, content, cover, id]
            );

            if (result.rows.length === 0) return res.status(404).json({ error: "Post not found" });
            res.json(result.rows[0]);
        } catch (err) {
            console.error("Error updating post:", err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


app.post('/posts',async(req,res) => {
    const {author,title,content,cover,date} = req.body;
    try {
        const result = await client.query
        ('insert into posts (author,title,content,cover,date) values ($1,$2,$3,$4,$5)',[author,title,content,cover,date]);
        res.status(201).send('post added successfully')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.delete('/posts/:id',async(req,res) => {
    const {id} = req.params;
    try {
        const result = await client.query('delete from posts where id= $1',[id]);
        res.send('post deleted');
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})