import mongoose from 'mongoose'

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)
mongoose.connect(url)

console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

const linkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

linkSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model("Link", linkSchema)