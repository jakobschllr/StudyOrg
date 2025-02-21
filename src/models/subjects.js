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

const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    credits: {
        type: String,
        required: true
    },
    todos: {
        type: Array,
        required: true
    },
    exams: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    grade: {
        type: Number,
        required: true
    }
})

subjectSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model("Subject", subjectSchema)