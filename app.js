const express=require('express');
require('dotenv').config()
const bodyParser=require('body-parser')
const morgan=require('morgan');
const  mongoose  = require('mongoose');
const routes = require('./routes/user');
const app=express();

app.use(morgan('dev'))
app.use(bodyParser.json())


mongoose.Promise=global.Promise;
mongoose.connect(process.env.mongo_uri)
.then(()=>{
    console.log('connected');
});

app.use(routes)

app.listen(process.env.PORT||8080,()=>{
 console.log('ruun')})
