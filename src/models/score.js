import mongoose from 'mongoose'

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)
mongoose.connect(url)

console.log('Connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

const scoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

scoreSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model("Score", scoreSchema)