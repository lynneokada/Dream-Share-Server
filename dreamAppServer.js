var express = require('express')
, mongoskin = require('mongoskin')
, bodyParser = require('body-parser')

var app = express()
app.use(bodyParser())

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})

//CREATE A NEW USER
app.post('/user', function(req, res)
{
  var users = db.collection("user")

  users.insert(req.body, {}, function(e, results){

  if (e) res.status(500).send()
  res.send(req.body._id.toString())

  })
})

//POST DREAM
app.post('/dreams', function(req, res)
{
  var dreams = db.collection("dream")
  req.body.mongoUser_id = new mongoskin.ObjectID(req.body.mongoUser_id)

  dreams.insert(req.body, {}, function(e, results)
  {
    if (e) res.status(500).send()
    res.send(results)
  })
})

//GET DREAM FROM FRIEND
app.get('/dreams/friends/:fbID', function(req, res)
{
  var users = db.collection("user")
  var dreams = db.collection("dream")

  users.findOne({fbUser_id:req.params.fbID},{}, function(error, user)
  {
    if(error)res.status(500).send()
    console.log(user)

    dreams.find({mongoUser_id:user._id},{}, function(error, results)
    {
      results.toArray(function(error, doc)
      {
        console.log(doc)
        res.send(doc)
      })
    })
  })
})

//SEARCH DREAM
app.get('/dreams/tags/:tag', function(req, res)
{
  var dreams = db.collection("dream")

  dreams.find({dreamTags:req.params.tag},{}, function(error, results)
  {
    if(error)res.status(500).send()
    results.toArray(function(error, docs)
    {
      console.log(docs)
      res.send(docs)
    })
  })
})

//NO
app.post('/comments/:dreamid', function(req, res)
{
  var dreamDB = db.collection("comments" + req.params.dreamid)

  dreamDB.insert(req.body,{},function(error,results){
    if(e) res.status(500).send()
    res.send(results)
  })
  //console.log(JSON.stringify(req.body))
})

app.get('/comments/:dreamid', function(req, res)
{
  var dreamDB = db.collection("comments" + req.params.dreamid)

  dreamDB.find({},{}).toArray(function(error,results){
    if(e) res.status(500).send()
    res.send(results)
  })
  console.log(JSON.stringify(req.body))
})

app.listen(3000)
