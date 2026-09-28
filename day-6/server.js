const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect("mongodb+srv://rohitnoni2006_db_user:q0AnBptMJUKzmGg6@cluster0.5wdz0d1.mongodb.net/day-6")
    .then(()=>{
        console.log("Connected to Databse")
    })
}

connectToDb()

app.listen(3000,()=>{
    console.log("Server is running")
})