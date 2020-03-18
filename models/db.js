const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/passport', {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false })
.then(()=>{
    console.log('connected to mongodb');    
})
.catch(err=>{console.log('error in connection with mongodb',err)})

