var express =require('express');
var app =new express();
var fs=require('fs');
var html=fs.readFileSync('./index.html');
app.use(express.static('./'))
app.use('/',function(req,res){
  res.end(html)
})
app.listen(3333)
