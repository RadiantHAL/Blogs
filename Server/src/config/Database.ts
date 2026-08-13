import mongoose  from "mongoose"

const connectToDB = async():Promise<void>=>{
    try{
        const mongoURI:string | undefined = process.env.MONGO_URI
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(mongoURI)
    }
    catch(error){
        console.error('Error connecting to Database:', error)
        process.exit(1)
    }
    finally {
        console.log('Connected to Database')
    }
}
export default connectToDB