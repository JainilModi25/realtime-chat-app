import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors';
import { authRouter } from './routes/AuthRoutes';

dotenv.config();    //all env variables can be called from .env file through process.env command
const app = express();
const Port = process.env.PORT;
const DB_url = process.env.DATABASE_URL;
// below is a way to handle TS if we 100% know that DATABASE_URL is a string, similar to ts-ignore
//const DB_url = process.env.DATABASE_URL as string; 
//@ts-ignore : another way to ignore TS errors
/*app.use(cors({
    origin: ["http://localhost:5173/"],    //defined the frontend url through which requests will be made
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],    //only allows these requests from the above origin frontend url
    credentials: true    //to enable cookies
}));
*/
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);


app.get('/', (req, res)=>{
    res.send("Hello world");
})

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});

//best way to handle DB_url TS error: type guard
if(!DB_url){
    throw new Error("Database url is not defined.")
}
mongoose.connect(DB_url).then(() => console.log("DB connection successful")).catch((err)=>console.log(err.message));