import mongoose from "mongoose";

const conectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DBCONECTIONSTRING);
        console.log("DB Conected");
    }catch (err){
        console.error(err)
        process.exit(1);
    }
}

export default conectDB();