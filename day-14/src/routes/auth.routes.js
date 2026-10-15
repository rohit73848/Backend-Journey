const express = require("express")

const authRouter = express.Router()

authRouter.post("/register",async (req,res)=>{
    const {email,username,password,bio,profileImage} = req.body;

    const isUserExistsByEmail = await userModel.findOne({email})
    
    if(isUserExistsByEmail){
        return res.status(409).json({
            message:"User already exists with same email"
        })
    }
    const isUserExistsByUserName = await userModel.findOne({username})

    if(isUserExistsByUserName){
        res.status(409).json({
            message:"User already exists with same user name"
        })
    }
})
