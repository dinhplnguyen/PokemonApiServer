const express = require("express")
const cors = require("cors")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();
const userModel = require("./userModel.js")
const { connectDB } = require("./connectDB.js")

const {
  PokemonBadRequest,
  PokemonDbError,
  PokemonAuthError
} = require("./errors.js")

const app = express()

app.use(express.json())
app.use(cors())

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });


  app.listen(process.env.authServerPORT, async (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
    const admin = await userModel.findOne({ "username": "admin" })
    if (!admin)
      userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
    const user = await userModel.findOne({ "username": "user" })
    if (!user)
      userModel.create({ username: "user", password: bcrypt.hashSync("user", 10), role: "user", email: "user@user.ca" })
  })
})
start()

app.use(express.json())


const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

const jwt = require("jsonwebtoken")
app.use('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonAuthError("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonAuthError("Password is incorrect")
  }

  if (!user.token) {
    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    await userModel.updateOne({ username }, { token })
    res.header('auth-token', token)
  } else {
    res.header('auth-token', user.token)
  }
  const updatedUser = await userModel.findOneAndUpdate({ username }, { "token_invalid": false })

  res.send(updatedUser)
}))


app.get('/logout', asyncWrapper(async (req, res) => {

  const user = await userModel.findOne({ token: req.query.appid })
  if (!user) {
    throw new PokemonAuthError("User not found")
  }
  await userModel.updateOne({ token: user.token }, { token_invalid: true })
  res.send("Logged out")
}))






app.use(handleErr)
