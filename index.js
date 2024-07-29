require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.json());

mongoose.connect("mongodb+srv://bharath21903:mech4004@cluster1.vmfq8fi.mongodb.net/noteapp");

const PORT=process.env.PORT || 4000;

app.get("/",(req,res)=>{
    res.send("App is Running")
})

const userSchema=new mongoose.Schema(
     {username:{type:String},
     email:{type:String},
     password:{type:String},}
)

const User=mongoose.model("User",userSchema);

// api creation for user registration
app.post("/register",async(req,res)=>{
    const {username,email,password}=req.body
    const userExist=await User.findOne({email:email});
    if(userExist){
      return  res.status(400).json({success:false,error:"User already exist"})
    }
    const user=new User({username:username,email:email,password:password});
    await user.save();
    res.status(201).send("Registration Successful")
})


// notes schema

const notesSchema=new mongoose.Schema(
    {
      content:{type:String},
      createdeAt:{type:Date}
    }
)

const Notes=mongoose.model("Notes",notesSchema);

// api for post the notes
app.post("/addNotes",async(req,res)=>{
    const {content,createdAt}=req.body;
    const note=new Notes({content,createdAt});
    await note.save();
    res.send("notes added successfully");
});

// get all the notes
app.get("/allNotes",async(req,res)=>{
    const notes=await Notes.find({})
    res.send(notes)
});


// delete note
app.post("/delete",async(req,res)=>{
    const {_id}=req.body;
    await Notes.findByIdAndDelete({_id});
    res.send("note removed successfully")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})