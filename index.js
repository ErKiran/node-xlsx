const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/v1',require('./routes'))

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is listening on the port ${port}`)
})