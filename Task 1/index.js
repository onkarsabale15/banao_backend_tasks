import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import routes from "./route/index.js"
dotenv.config()


const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const app = express()


app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(routes.authRoutes);


app.get("/api/v1/health", (req, res) => {
    res.send("<h1>Server is up and running</h1>")
})


mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})