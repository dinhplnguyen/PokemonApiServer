const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const morgan = require("morgan")
const cors = require("cors")


const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./errors.js")

const { asyncWrapper } = require("./asyncWrapper.js")

const dotenv = require("dotenv")
dotenv.config();



const app = express()
// const port = 5000
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });
  const pokeSchema = await getTypes();
  // pokeModel = await populatePokemons(pokeSchema);
  pokeModel = mongoose.model('pokemons', pokeSchema);

  app.listen(process.env.pokeServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
  })
})
start()
app.use(express.json())
const jwt = require("jsonwebtoken")
// const { findOne } = require("./userModel.js")
const userModel = require("./userModel.js")

const authUser = asyncWrapper(async (req, res, next) => {
  // const to ken = req.header('auth-token')
  const token = req.query.appid
  if (!token) {
    throw new PokemonAuthError("No Token: Please provide an appid query parameter.")
  }
  const userWithToken = await userModel.findOne({ token })
  if (!userWithToken || userWithToken.token_invalid) {
    throw new PokemonAuthError("Please Login.")
  }
  try {
    // console.log("token: ", token);
    const verified = jwt.verify(token, process.env.TOKEN_SECRET) // nothing happens if token is valid
    next()
  } catch (err) {
    throw new PokemonAuthError("Invalid user.")
  }
})

const authAdmin = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ token: req.query.appid })
  if (user.role !== "admin") {
    throw new PokemonAuthError("Access denied")
  }
  next()
})

const addCalledApiToUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ token: req.query.appid })
  const trimUrl = req.originalUrl.split("?")[0]

  if (user) {

    const visitedApi = await user.visitedApi.find(api => api.links === trimUrl)
    console.log("visitedApi: ", visitedApi);
    if (visitedApi) {
      await user.updateOne(
        {
          visitedApi: user.visitedApi.map(api => {
            if (api.links === trimUrl) {
              api.count++
            }
            return api
          })
        }
      )
    } else {
      user.visitedApi.push({ links: trimUrl, count: 1 })
      console.log("user.visitedApi: ", user.visitedApi);
    }
  } else {
    throw new PokemonAuthError("Please Login.")
  }
  await user.save()
  next()
})


// app.use(morgan("tiny"))
app.use(morgan(":method"))

app.use(cors())

// send an api to get visited api
app.get('/api/v1/visitedapi', asyncWrapper(async (req, res) => {
  // try {
  const docs = await userModel.find({}, { visitedApi: 1, _id: 0 })
  // if users have same api, add the count together and return the result to the user 
  const visitedApi = docs.reduce((acc, cur) => {
    cur.visitedApi.forEach(api => {
      const found = acc.find(a => a.links === api.links)
      if (found) {
        found.count += api.count
      } else {
        acc.push(api)
      }
    })
    return acc
  }, [])
  res.json(visitedApi)
  // res.json(docs)
}))

// send an api, and user can see the count of the api
app.get('/api/v1/topapiuser', asyncWrapper(async (req, res) => {
  const docs = await userModel.find({})

  const topApiUser = docs.reduce((acc, cur) => {
    let count = 0
    cur.visitedApi.forEach(api => {
      count += api.count
    })
    acc.push({ username: cur.username, count })
    return acc
  }, [])
  topApiUser.sort((a, b) => b.count - a.count)
  res.json(topApiUser)
}))

// send an api, user and count of the api
app.get('/api/v1/topusereach', asyncWrapper(async (req, res) => {
  const docs = await userModel.find({})

  // return the api and one user who visited the most
  const topUserEach = docs.reduce((acc, cur) => {
    cur.visitedApi.forEach(api => {
      const found = acc.find(a => a.links === api.links)
      if (found) {
        if (found.count < api.count) {
          found.count = api.count
          found.username = cur.username
        }
      } else {
        acc.push({ links: api.links, count: api.count, username: cur.username })
      }
    })
    return acc
  }, [])
  res.json(topUserEach)

}))


app.use(authUser) // Boom! All routes below this line are protected
app.use(addCalledApiToUser)


app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  // try {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)



}))

app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const { id } = req.params
  const docs = await pokeModel.findOne({ id: id })
  if (docs.length != 0) res.json(docs)
  else res.json({ errMsg: "Pokemon not found" })
  // } catch (err) { res.json(handleErr(err)) }
}))
app.get("*", (req, res) => {
  // res.json({
  //   msg: "Improper route. Check API docs plz."
  // })
  throw new PokemonNoSuchRouteError("");
})

app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  // try {
  console.log(req.body);
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
  // } catch (err) { res.json(handleErr(err)) }
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    throw new PokemonNotFoundError("");
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  // console.log(docs);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({ msg: "Not found", })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))

app.use(handleErr)
