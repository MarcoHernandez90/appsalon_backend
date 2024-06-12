import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { uniqueID } from '../utils/index.js'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  /* Token para identificar a los usarios que ya confirmaron su cuenta y
    permitirles restaurarla (nosotros los generamos) */
  token: {
    type: String,
    default: () => uniqueID()
  },
  verified: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User