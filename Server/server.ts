import dotenv  from "dotenv/config"
import connectToDB from "./src/config/Database"
import app from "./src/app"
dotenv
connectToDB()
app.listen(3000,()=>{
    console.log("Server running on port 3000")
}) 