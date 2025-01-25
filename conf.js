import dotenv from 'dotenv'

dotenv.config()


console.log(process.env.MONGO_URI)
export const config = {
    mongoURI: process.env.MONGO_URI,
}