import express from 'express'
import dotenv from 'dotenv'
import client from './db.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

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

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})