const express = require("express")
const mongodb = require("mongodb")
const cors = require("cors")
const app = express()
const mongoClient = mongodb.MongoClient
const dbUrl = "mongodb+srv://root:root@cluster0.vza7a.mongodb.net/<dbName>?retryWrites=true&w=majority"
app.use(express.json())
app.use(cors())
app.get("/", (req, res)=>{
  res.send("<h1>Welcome</h1>")
})

app.post("/create-user", async(req, res)=>{
  const client = await mongoClient.connect(dbUrl)
  try{
    const db = client.db("myDB")
    const user = await db.collection("users").insertOne(req.body)
    res.json({
      message : "User Created"
    })
  }
  catch(error){
    res.json("Somthing went wrong")
  }
  finally{
    client.close()
  }
})

app.get("/get-users", async (req, res)=>{
  const client = await mongoClient.connect(dbUrl)
  try{
    const db = client.db("myDB")
    const users = await db.collection("users").find().toArray()
    res.json(users)
  }
  catch(error){
    res.json({
      message : "Something went wrong"
    })
  }
  finally{
    client.close()
  }
})

app.get("/single-user/:id", async(req, res)=>{
  const objId = mongodb.ObjectID(req.params.id)
  const client = await mongoClient.connect(dbUrl)
  try{
    const db = client.db("myDB")
    const user = await db.collection("users").findOne({_id : objId})
    res.json(user)
  }
  catch(error){
    res.json({
      message : "Something went wrong"
    })
  }
  finally{
    client.close()
  }
})

app.put("/update-user/:id", async (req, res)=>{
  const objId = mongodb.ObjectID(req.params.id)
  const client = await mongoClient.connect(dbUrl)
  try{
    const db = client.db("myDB")
    const user = await db.collection("users").findOne({_id : objId})
    if(user){
      const updatedUser = await db.collection("users").findOneAndUpdate({_id : objId}, {$set: {name : req.body.name}})
      res.json({
        message : "User updated"
      })
    }
    else{
      res.json({
        message : "No user found"
      })
    }
  }
    catch(error){
      res.json({
        message : "Something went wrong"
      })
    }
    finally{
      client.close()
    }
})

app.delete("/delete-user/:id", async (req, res)=>{
  const objId = mongodb.ObjectID(req.params.id)
  const client = await mongoClient.connect(dbUrl)
  try{
    const db = client.db("myDB")
    const user = await db.collection("users").findOne({_id : objId})
    if(user){
      const deletedUser = await db.collection("users").findOneAndDelete({_id : objId})
      res.json({
        message : "User deleted"
      })
    }
    else{
      res.json({
        message : "No user found"
      })
    }
  }
    catch(error){
      res.json({
        message : "Something went wrong"
      })
    }
    finally{
      client.close()
    }
})
const port = 3010

app.listen(port, ()=>{
  console.log("Server started")
})