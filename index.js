import express from "express";
import mongoose from "mongoose"
import User from "./models/user.js";
import userRouter from "./routers/userRouter.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken"


const app = express()

app.use(bodyParser.json())

//.. middlware by project,........
app.use(
    (req, res, next) => {
        const value = req.header("Authorization")
        if (value != null) {
            const token = value.replace("bearer", "")
            jwt.verify(
                token,
                "km-2386",
                (err, decoded)=> {
                    if (decoded == null) {
                        res, status(403).json({
                            massage: "Unauthorized"
                        })
                    } else {
                        req.user =decoded
                        next()

                    }


                }
            )
        } else {

        }
        next()
    }

)


const connectionString = "mongodb+srv://kandyan999:magrowhisky9@cluster0.76erusa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionString).then(
    ()=> {

    }

).catch(
    ()=> {

    }
)

app.use("/users", userRouter)

app.listen(5000,
    ()=> (
        
    )


)
