const express=require('express');
require('dotenv').config()
const bodyParser=require('body-parser')
const morgan=require('morgan');
const mongoose  = require('mongoose');
const registRoutes = require('./routes/user');
const postRoutes=require('./routes/posts')
const operationsRoutes=require('./routes/user_operations')
const commentRoutes=require('./routes/comments')
const likeRoutes=require("./routes/likes")




const app=express();

app.use(morgan('dev'))
app.use(bodyParser.json())

mongoose.Promise=global.Promise;
mongoose.connect(process.env.mongo_uri)
.then(()=>{
    console.log('connected');
});

app.use('/like',likeRoutes)
app.use('/post',postRoutes)
app.use('/user',operationsRoutes)
app.use(commentRoutes);
app.use(registRoutes)


app.listen(process.env.PORT||8080,async()=>{
 console.log('ruun')   

})
