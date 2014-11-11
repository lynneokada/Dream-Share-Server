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

//POST COMMENT
app.post('/comments', function(req, res)
{
  var comment = db.collection("comments")

  comment.insert(req.body, {}, function(e, results){
    if (e) res.status(500).send()
    res.send(results)
    console.log("commented!!")
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

    dreams.find({mongoUser_id:user._id},{}).toArray(function(error, results)
    {
        res.send(results)
    })
  })
})

//SEARCH DREAM
app.get('/dreams/tags/:tag', function(req, res)
{
  var dreams = db.collection("dream")

  dreams.find({dreamTags:req.params.tag},{}).toArray(function(error, results)
  {
    if (error)res.status(500).send()
    res.send(results)
  })
})

//DELETE DREAM
app.delete('/dreams/:dreamid', function(req, res)
{
  var dreams = db.collection("dream")

  req.dreams.removeById(req.params.id, function(error, result){
    if (error)res.status(500).send()
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

//UPDATE DREAM
app.put('/dreams/:dreamid', function(req, res)
{
  var dreams = db.collection("dream")

  dream.findOne({_id:req.params.dreamid},{}, function(error, results)
  {
    if (error)res.status(500).send()
    res.send(results)
  })
})

//GET COMMENTS
app.get('/comments/:dreamid', function(req, res)
{
  var comment = db.collection("comments")

  comment.find({dream_id:req.params.dreamid},{}).toArray(function(error, results)
  {
    if (error)res.status(500).send()
    res.send(results)
  })
})

app.listen(3000)
