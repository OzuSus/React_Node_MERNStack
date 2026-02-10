import mongoose from "mongoose";

const conectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB Conected");
    }catch (err){
        console.error("DB conection error:",err);
        process.exit(1);
    }
}

export default conectDB;