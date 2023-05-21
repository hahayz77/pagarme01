import mongoose from "mongoose";

class Database {
    constructor(){
        this.connection = mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }
}


export default new Database();