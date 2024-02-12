import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || {conn:null, promise:null};
export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;
    console.log("URI",MONGODB_URI);
    
    if(!MONGODB_URI) throw new Error("MONGODB_URI is missing");
    cached.promise = cached.promise || await mongoose.connect(MONGODB_URI, {
        dbName:'evently',
        bufferCommands: false
    })
    console.log("Database connection function from create user!");
    cached.conn = await cached.promise;
    return cached.conn;
}