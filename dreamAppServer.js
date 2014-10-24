var express = require('express')
, mongoskin = require('mongoskin')
, bodyParser = require('body-parser')

var app = express()
app.use(bodyParser())

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})

app.get('/dream', function(req, res) {
var collection = db.collection("dream")

collection.find({} ,{}).toArray(function(e, results){
if (e) res.status(500).send()
res.send(results)
})
})

app.post('/dream', function(req, res) {
  var collection = db.collection("dream")

  collection.insert(req.body, {}, function(e, results){

  if (e) res.status(500).send()
    res.send(results)
  })
})

app.del('/dream', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.listen(3000)
