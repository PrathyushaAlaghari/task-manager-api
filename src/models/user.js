const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age should be positive')
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please provide valid emaail address')
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      // validate(value) {
      //   if (!validator.isLength(value, { min: 6 })) {
      //     throw new Error(
      //       'Length of password should be greater than 6 characters'
      //     )
      //   }
      // },
      minlength: 7,
      validate(value) {
        if (value.includes('password')) {
          throw new Error('password should not contain password')
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.toJSON = function () {
  const user = this

  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.API_SECRET_KEY
  )

  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token
}

userSchema.virtual('tasks', {
  ref: 'tasks',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.statics.getUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    console.log('56')
    throw new Error('Unable to find the user')
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

//hash the password before saving it
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('deleteOne', { document: true }, async function (next) {
  try {
    const user = this
    const result = await Task.deleteMany({ owner: user._id })
  } catch (error) {
    console.error('Error deleting tasks:', error)
  } finally {
    next()
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User
