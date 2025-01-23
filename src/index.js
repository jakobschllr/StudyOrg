import app from './app.js'
import Subject from './models/subjects.js'
import Link from './models/links.js'
import Habit from './models/habits.js'
import User from './users/user.js'
import Score from './models/score.js'

import crypto from 'crypto'

// get all data
app.get('/api/data/:userId', (request, response) => {
  const userId = request.params.userId

  Subject.find({ userId: userId }).then(subjects => {
    Link.find({ userId: userId }).then(links => {
      Habit.find({ userId: userId }).then(habits => {
        Score.find({ userId: userId }).then(score => {
          console.log('All data was fetched from database and is send to frontend')
          response.json({subjects: subjects, links: links, habits: habits, score: score[0]})
        })
        .catch(error => {
          console.log(error)
          response.status(500).send({ error: "Score couldn't be found in database"})
        })
      })
      .catch(error => {
        console.log(error)
        response.status(500).send({ error: "Habit couldn't be found in database"})
      })
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({ error: "Link couldn't be found in database"})
    })
  })
  .catch(error => {
    console.log(error)
    response.status(500).send({ error: "Subject couldn't be found in database"})
  })
})

// add subject
app.post('/api/data/subjects', (request, response) => {
  const newSubject = request.body.subject
  const userId = request.body.userId

  const subject = new Subject({
    title: newSubject.title,
    credits: newSubject.credits,
    todos: newSubject.todos,
    exams: newSubject.exams,
    userId: userId,
    passed: newSubject.passed,
    grade: newSubject.grade
  })

  subject.save()
    .then(savedSubject => {
      console.log('Subject was added to database: ' + savedSubject)
      response.json(savedSubject)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({ error: "Subject couldn't be saved to database"})
    })
})

// delete subject
app.delete('/api/data/subjects/:id', (request, response) => {
    Subject.findByIdAndDelete(request.params.id)
      .then(result => {
        console.log('Deleted subject: ' + result)
        response.status(204).end()
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: "Subject could not be deleted from database - check User ID" }) // Bad Request
      })
})

// change subject
app.put('/api/data/subjects/:id', (request, response) => {
  const title = request.body.title
  const todos = request.body.todos
  const exams = request.body.exams
  const passed = request.body.passed
  const grade = request.body.grade

  Subject.findByIdAndUpdate(request.params.id, {title, todos, exams, passed, grade}, { new: true, runValidators: true, context: 'query'})
    .then(updatedSubject => {
      console.log('Updated Subject with new data: ' + updatedSubject)
      response.json(updatedSubject)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "Subect couldn't be updated - check parameters" })
    })
})

// add link
app.post('/api/data/links', (request, response) => {
  const newLink = request.body.link
  const userId = request.body.userId

  const link = new Link({
    name: newLink.name,
    url: newLink.url,
    userId: userId
  })

  link.save()
    .then(savedLink => {
      console.log('Saved new link to database: ' + savedLink)
      response.json(savedLink)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "Link couldn't be saved - check parameters"})
    })
})

// delete link
app.put('/api/data/links', (request, response) => {
  const changedIds = request.body

  let success = true;

  for (let i = 0; i < changedIds.length; i++) {
    Link.findByIdAndDelete(changedIds[i])
      .then(result => {
        console.log("Deleted links from database " + changedIds[i])
      })
      .catch(error => {
        console.log(error)
        success = false
      })
  }
  
  if (success) {
    response.status(204).end() // success
  } else {
    response.status(400).send({ error: "Couldn't find Habits to delete in database - check user IDs" }) // internal server error
  }

})

// add habit
app.post('/api/data/habits', (request, response) => {
  const newHabit = request.body.habit
  const userId = request.body.userId
  const habit = new Habit({
    name: newHabit.name,
    nextDate: newHabit.nextDate,
    userId: userId
  })
  habit.save()
    .then(savedHabit => {
      console.log('Saved to habit to database: ' + savedHabit)
      response.json(savedHabit)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({ error: "Couldn't save habit to database" })
    })
})

// delete habit
app.delete('/api/data/habits/:id', (request, response) => {
  Habit.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('Deleted habit from database: ' + result)
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "Habit couldn't be found in database, check user ID" })
    })
})

// check habit as done
app.put('/api/data/habits/:id', (request, response) => {
  
  const { name, nextDate } = request.body.habit
  const userId = request.body.userId
  const scoreId = request.body.score.id
  const score = request.body.score.score

  Habit.findByIdAndUpdate(request.params.id, {name, nextDate}, {new: true, runValidators: true, context: 'query'})
    .then(updatedHabit => {
      Score.findByIdAndUpdate(scoreId, {score}, {new: true, runValidators: true, context: 'query'})
        .then(resp => {
          console.log('Updated habit date to next day: ' + updatedHabit)
          response.json(updatedHabit)
        })
        .catch(error => {
          console.log(error)
          response.status(400).send({ error: "Couldn't find Score - check User ID" })
        })
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "Couldn't find Habit - check User ID" })
    })
})

// login user
app.post('/api/data/users/login', (request, response) => {
  const userObj = request.body
  let foundUser = false
  User.find({}).then(users => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === userObj.username && decryptPassword(users[i].password) === userObj.password) {
        foundUser = true
        console.log('User login successful: ' + users[i])
        response.json(users[i])
      }
    }
    if (!foundUser) {
      response.json({status: null})
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: "Couldn't find User in database, check username and password" })
  })
})

// signup user
app.post('/api/data/users/signup', (request, response) => {
  const userObj = request.body
  const user = new User({
    username: userObj.username,
    major: userObj.major,
    password: encryptPassword(userObj.password),
    score: userObj.score,
    email: userObj.email,
    createdAt: userObj.createdAt
  })

  user.save()
    .then(savedUser => {

      const score = new Score({
        score: 0,
        userId: savedUser.id
      })

      score.save()
        .then(_ => {
          console.log('New user signup and saved to database: ' + savedUser)
          response.json(savedUser)
        })
        .catch(error => {
          console.log(error)
          response.status(500).send({ error: "Score couldn't be saved at signup" })
        })
    })
    .catch(error => {
      response.json({status: null})
    })
})

const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex') // import encryption key as hex and transform to binary
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex')


// encrypt password
const encryptPassword = (pswrd) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encrypted = cipher.update(pswrd, 'utf8', 'hex') + cipher.final('hex')
  return encrypted
}

// decrypt pasword
const decryptPassword = (pswrd) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(pswrd, 'hex', 'utf8')
  const decryptedPassword = decrypted + decipher.final('utf8')
  return decryptedPassword
}

const PORT = process.env.PORT || 3001

console.log('Port: ' + PORT)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})