import express from 'express'
import dotenv from 'dotenv'
import client from './db.js';

dotenv.config();

const PORT = process.env.PORT;

const app= express();

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})

app.get('/',async (req,res) => {
    try {
         res.json({message: 'server is running'});
    } catch (error) {
        res.status(500).send(error.message)
    }
})

