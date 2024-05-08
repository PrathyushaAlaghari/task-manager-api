const express = require('express')
require('./db/mongoose.cjs')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
const multer = require('multer')

const upload = multer({
  dest: 'upload',
  limits: {
    fileSize: 500000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a word doc'))
    }
    cb(undefined, true)
  },
})

app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
})

app.use(userRouter)
app.use(taskRouter)

app.listen(3000, () => {
  console.log('Server is running on port: ', port)
})
