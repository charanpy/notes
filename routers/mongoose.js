const mongoose=require("mongoose");

const depreceate={ useNewUrlParser: true , useUnifiedTopology: true };
mongoose.connect(process.env.ID,depreceate);

//Schema
const notesSchema={
    date:String,
    time:String,
    title:String,
    sub:String,
    resource:String,
    description:String,
    fav:false,
    img: 
    { 
        data:Buffer, 
        contentType:String 
    },
    imgs:String
    
};
//model
const Notes=mongoose.model("Topic",notesSchema);

const userSchema={
    email:String,
  
    username:String,
    password:String,
    item:[notesSchema]
}
const Users=mongoose.model("User",userSchema);

module.exports={
    Notes,
    Users

}