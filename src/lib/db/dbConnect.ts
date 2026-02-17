import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}
async function dbConnect():Promise<void>{
    if (connection.isConnected) {
        console.log("Database already connected")
        return
    }
    try {
        const db =await mongoose.connect("mongodb+srv://krishna:krishna@cluster0.o15qvll.mongodb.net/?appName=cluster0")
        connection.isConnected=db.connections[0].readyState
        console.log("db connected sucessfully")
    } catch (error) {
        console.log("database connection failed", error)

        process.exit(1)
    }
}

export default dbConnect