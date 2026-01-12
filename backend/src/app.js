const express= require("express");

const connectDB= require("./config/database");

const app= express();
const cookieParser = require("cookie-parser");
const cors= require("cors");

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,

})
);


app.use(express.json());
app.use(cookieParser());

const createAdminIfNotExists = require("./utils/createAdmin");



const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const issueRouter = require("./routes/issue");

app.use("/api/auth",authRouter);
app.use("/api/profile",profileRouter);
app.use("/api/issues",issueRouter);


connectDB()
    .then(async ()=>{
    console.log("Database connection establised...");

    await createAdminIfNotExists();
    app.listen(3000,()=>{
    console.log("server is successfully running on port 3000");
});
    })  
    .catch(err=>{
    console.log("Database cannot be connected...",err);

})