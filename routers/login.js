const express=require("express");

const router=express.Router();

var Alert = require("js-alert");

router.get("/",(req,res)=>{
    res.render('login',{message:req.flash('message')});
})



const mongoose=require('./mongoose');
const Users=mongoose.Users;
console.log(mongoose.Users)
const bcrypt=require('bcrypt');
/*
router.post("/",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    Users.findOne({username:username},(err,foundUser)=>{
        if(err){
            console.log(err)
        }
        else if(foundUser){
            bcrypt.compare(password,foundUser.password,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else if(result){
                    res.render("notes",{users:foundUser})}
                else{
                    console.log("Incorrect Password")
                }
            })
        }
        else{
            console.log("user not found");
        }
    })
 
 })
 
*/
//register
router.post("/register",(req,res)=>{
   const name=req.body.username;
   const email=req.body.email;
   const password=req.body.password;
  console.log(mongoose.Users)
    mongoose.Users.findOne({email:req.body.email},function(err,foundUser){
        if(!err){
            if(!foundUser){
                bcrypt.hash(password,10, function(err, hash) {
                    console.log(hash);
                    if(err){
                        console.log(err)
                    }
                    else{
                        
                        const user=new Users({
                            email:email,
                            username:name,
                            password:hash
                        })
                        user.save((err,found)=>{
                            if(err){
                                console.log(err)
                            }
                            console.log('suc')
                            req.flash('message','Registered')
                            res.redirect("/");
                        });
                        
                    }
                });

            }
            else{
                req.flash('message','Email already registered')
                            res.redirect("/");
            }
        }
    })
   
const id='';

})
//login
router.post("/note",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    Users.findOne({username:username},(err,foundUser)=>{
        if(err){
            console.log(err)
        }
        else if(foundUser){
            bcrypt.compare(password,foundUser.password,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else if(result){
                    id=foundUser._id;
                    res.redirect('/notes')}
                else{
                    req.flash('message','Incorrect Password')
                    res.redirect('/')
                    console.log("Incorrect Password")
                }
            })
        }
        else{
            console.log("user not found");
        }
    })
 
 })
//notes display
 router.get("/notes",(req,res)=>{
     try{
     Users.findById({_id:id},(err,foundUser)=>{
         if(err){
             console.log(err)
         }
         else if(foundUser){
             res.render("notes",{users:foundUser,message: req.flash('delete'),messages:req.flash('fav')})
         }
         else{
             res.send("Login")
         }
     })}
     catch(e){
         res.redirect('/');
     }
 })
//create note
 router.post("/post",(req,res)=>{
     res.redirect('/post');
 })

 router.get("/post",(req,res)=>{
     res.render("post")
 })
//multer
 var multer = require('multer'); 

 var storage = multer.diskStorage({ 
     destination: (req, file, cb) => { 
         cb(null, __dirname+'/uploads') 
     }, 
     filename: (req, file, cb) => { 
         cb(null, file.fieldname + '-' + Date.now()) 
     } 
 }); 
 
 var upload = multer({ storage: storage }); 

 var fs = require('fs'); 
 var path = require('path'); 
//create note
 router.post("/compose",upload.single('recfile'),function(req,res){
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output = month  + ''+ day  + ',' + year;
    var today = new Date();
var days=today.getHours()
    var time =days+":"+today.getMinutes();



   console.log(output)
    console.log('hi',req.body.postTitle,req.body.sub,req.body.postBody,req.body.link);
    var dat;
    var c;
    //if user uploads img
    try{
        dat=fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))
        c='image/png'
        var obj =new mongoose.Notes({ 
            date:output,
            time:time,
            title:req.body.postTitle,
            sub:req.body.sub,
            resource:req.body.link,
        description:req.body.postBody,
        imgs:'a',
            img: { 
                data:dat,
                contentType:c
            } 
        } )
        obj.save();
    }
    //if user doesn't upload img
   catch(e){
    var obj =new mongoose.Notes({ 
        date:output,
        time:time,
        title:req.body.postTitle,
        sub:req.body.sub,
        resource:req.body.link,
    description:req.body.postBody,
   img:undefined,
        imgs:'https://cdn.pixabay.com/photo/2015/06/19/21/24/the-road-815297__340.jpg' 
    } )
    obj.save();
   }

    
 
    obj.save();
     
    Users.findOneAndUpdate({_id:id},{$push:{item:obj}},(err,result)=>{
        if(result){
            req.flash('delete','Uploaded')
            res.redirect("/notes")
        }
    })
   });

//displaying individual notes
router.get("/post/:id",(req,res)=>{
    const ids=req.params.id;
    console.log(ids,mongoose.Notes)
 Users.findById({_id:id},(err,result)=>{
   
     var r=result.item.filter((img)=>img._id==req.params.id)
     console.log(r[0]);
     res.render("index",{result:r[0],message: req.flash('ipdate')})
 })
/*    mongoose.Notes.findById({_id:ids},(err,result)=>{
        res.render("index",{result:result})
    })
*/
})
//deleting notes
router.post("/delete/:id",(req,res)=>{
    Users.findByIdAndUpdate({_id:id},{$pull:{item:{_id:req.params.id}}},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            req.flash('delete','Deleted')
            res.redirect('/notes')
        }
    })
})
//updating existing notes
router.get('/update/:id',(req,res)=>{
    Users.find({_id:id},(err,result)=>{
        if(err){
            console.log(err)
        }
       
       
       var c=result[0].item.filter((user,i)=>user._id==req.params.id)
       console.log(c);
       
       res.render("update",{sd:id,id:c[0]._id,user:c[0].title,sub:c[0].sub,resource:c[0].resource,description:c[0].description})  

    })
})
router.post("/update/:id",upload.single('recfile'),(req,res)=>{
   
    Users.find({_id:id},(err,result)=>{
        if(err){
            console.log(err)
        }
       
       
       var c=result[0].item.filter((user,i)=>user._id==req.params.id)
       console.log(c[0].img);
       if(c[0].imgs[0]==='h' && c[0].img===undefined){

        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output = month  + ''+ day  + ',' + year;
    var today = new Date();
var days=today.getHours()
    var time =days+":"+today.getMinutes();
    var dat;
    var c;
    var date,time,title,sub,resource,description,img,imgs;


   
    try{
        dat=fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))
        c='image/png'
       
            date=output,
            time=time,
            title=req.body.postTitle,
            sub=req.body.sub,
            resource=req.body.link,
        description=req.body.postBody,
            img= { 
                data:dat,
                contentType:c
            } 


            Users.updateOne({_id:id,"item._id":req.params.id},{$set:{"item.$.title":req.body.postTitle,"item.$.sub":req.body.subs,
        "item.$.resource":req.body.link,
    "item.$.description":req.body.postBody}},(err,result)=>{
                if(err){
                    console.log(err)
                }
                console.log(result)
               /* Users.updateOne({_id:id,"item._id":req.params.id},[{$addFields:{"item.$[].img":img}}],(err,results)=>{
                    if(err){
                        console.log(err)
                    }
console.log(results)
                    res.redirect("/post/"+req.params.id)
                })*/
                Users.update(
                    {_id:id, 'item._id':req.params.id },
                    {$push:{'item.$.img':img}},
                    (err,resu)=>{
                        if(err){
                            console.log(err)
                        }
                        req.flash('update','Updated!')
                        console.log('s',resu)

                    }
                  );
               
            })
        
       
    }
   catch(e){
   
        date=output,
        time=time,
        title=req.body.postTitle,
        sub=req.body.sub,
        resource=req.body.link,
    description=req.body.postBody,
   
        imgs='https://cdn.pixabay.com/photo/2015/06/19/21/24/the-road-815297__340.jpg' 
   
   
        Users.updateOne({_id:id,"item._id":req.params.id},{$set:{"item.$.title":req.body.postTitle,"item.$.sub":req.body.subs,
        "item.$.resouce":req.body.link,
    "item.$.description":req.body.postBody}},(err,result)=>{
                if(err){
                    console.log(err)
                }
                req.flash('update','Updated!')
                console.log(result)
            })
    
    





       }
    
    }
    else{
        var dat;
    var c;
    var date,time,title,sub,resource,description,img,imgs;


   
   try{
        dat=fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))
        c='image/png'
       
            
            title=req.body.postTitle,
            sub=req.body.sub,
            resource=req.body.link,
        description=req.body.postBody,
            img= { 
                data:dat,
                contentType:c
            } 


            Users.updateOne({_id:id,"item._id":req.params.id},{$set:{"item.$.title":req.body.postTitle,"item.$.sub":req.body.subs,
        "item.$.resource":req.body.link,
    "item.$.description":req.body.postBody}},(err,result)=>{
                if(err){
                    console.log(err)
                }
                console.log(result)
                Users.updateOne({_id:id,"item._id":req.params.id},{$set:{"item.$.img.data":img.data,"item.$.img.contentType":img.contentType}},(err,results)=>{
                    if(err){
                        console.log(err)
                    }
console.log('s',results)
req.flash('update','Updated!')
                    res.redirect("/post/"+req.params.id)
                })
               
            })
        
        }

        catch(e){

            title=req.body.postTitle,
            sub=req.body.sub,
            resource=req.body.link,
        description=req.body.postBody,
            img= { 
                data:dat,
                contentType:c
            } 


            Users.updateOne({_id:id,"item._id":req.params.id},{$set:{"item.$.title":req.body.postTitle,"item.$.sub":req.body.subs,
        "item.$.resource":req.body.link,
    "item.$.description":req.body.postBody}},(err,result)=>{
                if(err){
                    console.log(err)
                }
                console.log(result)
               
                req.flash('update','Updated!')
                res.redirect("/post/"+req.params.id)
        })}
    








    }
    })

    console.log(req.body,req.params.id);
    
 })
//fav notes
 router.post("/fav/:id",(req,res)=>{
     console.log(req.params.id);
     Users.update({_id:id,"item._id":req.params.id},{$set:{"item.$.fav":true}},(err,result)=>{
         if(err){
            req.flash('deletePostErrorMsg', 'Something went wrong while deleting post!');
             console.log(err)
         }
         req.flash('deletePostSuccessMsg', 'Post deleted successfully!');
         console.log(result)
         req.flash('fav','Added to fav')
         res.redirect("/notes/#"+req.params.id)

     })
     
 })
//removing notes from fav
 router.post("/nfav/:id",(req,res)=>{
    console.log(req.params.id);
    Users.update({_id:id,"item._id":req.params.id},{$set:{"item.$.fav":false}},(err,result)=>{
        if(err){
            console.log(err)
        }
        console.log(result)
        req.flash('fav','Removed from fav')
        res.redirect("/notes/#"+req.params.id)

    })
    
})
router.get("/favourite",(req,res)=>{
    Users.find({_id:id},(err,found)=>{
        if(err){
            console.log(err)
        }
        const fav=found[0].item.filter((item)=>item.fav===true)
        res.render('fav',{user:fav,messages:req.flash('del')})
    })
})
//deletinf notes from fav
router.post("/remove/:id",(req,res)=>{
    Users.update({_id:id,"item._id":req.params.id},{$set:{"item.$.fav":false}},(err,result)=>{
        if(err){
            console.log(err)
        }
        console.log(result)
        req.flash('del','Deleted')
        res.redirect("/favourite")

    })
})

module.exports=router;