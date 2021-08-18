const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({origin: '*'}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/v1',require('./routes'))

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is listening on the port ${port}`)
})