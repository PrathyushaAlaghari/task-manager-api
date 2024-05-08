const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeMail, sendDeleteMail } = require('../emails/accounts')
const sharp = require('sharp')
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload a jpg/jpeg/png file'))
    }

    cb(undefined, true)
  },
})

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeMail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
  const updateFields = Object.keys(req.body)
  const canUpdate = ['name', 'age', 'email', 'password']

  const isValidOperation = updateFields.every((update) => {
    return canUpdate.includes(update)
  })

  if (!isValidOperation) {
    return res.status(404).send()
  }

  try {
    updateFields.forEach((update) => {
      req.user[update] = req.body[update]
    })

    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    sendDeleteMail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send('delete user error block')
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.getUserByCredentials(
      req.body.email,
      req.body.password
    )

    const token = await user.generateAuthToken()

    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()

    res.send()
  } catch (e) {
    res.stauts(500).send()
  }
})

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('File uploaded')
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  }
)

router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined

    await req.user.save()
    res.send('Avatar deleted!')
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  }
)

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router
