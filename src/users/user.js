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

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        requried: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
})

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model("User", userSchema)