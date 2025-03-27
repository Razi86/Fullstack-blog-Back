import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const app= express();
app.use(express.json());
app.use(cors());

app.get('/',async (req,res) => {
    try {
         res.json({message: 'server is running'});
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/posts',async(req,res) => {
    const {author,title,content,cover,date} = req.body;
    try {
        const result = await db.query
        ('insert into posts (author,title,content,cover,date) values ($1,$2,$3,$4,$5)',[author,title,content,cover,date]);
        res.status(201).send('post added successfully')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.delete('/posts/:id',async(req,res) => {
    const {id} = req.params;
    try {
        const result = await db.query('delete from posts where id= $1',[id]);
        res.send('post deleted');
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})