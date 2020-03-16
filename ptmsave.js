var fs = require('fs');
var pathUtil = require('path');
var http = require('http');
//var https = require('https');
var formidable = require('formidable');

const winston = require('./winston');

var conf = require('./conf.json')

// 업로드 된 파일 경로
var uploadDir = __dirname + '/upload';

// 이미지 파일 경로
//var imageDir = __dirname + '/image';
var imageDir = conf.imageDir;

//포트 번호 입력
var port = conf.port;

/*
var options = {
    key: fs.readFileSync('keys/key.pem', 'utf8'),
    cert: fs.readFileSync('keys/server.crt', 'utf8')
};
*/

http.createServer(function (req, res) {
   if (req.url == '/' && req.method.toLowerCase() == 'get') {
   	  winston.info("GET method try");
   	  res.statusCode = 200;
   	  res.writeHead(200, { 'Content-Type': 'application/pdf' });
      res.end(res);
   }else if (req.method.toLowerCase() == 'get' && req.url.indexOf('/image') == 0) {
      winston.info("GET method try");
      var path = __dirname + req.url;
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      fs.createReadStream(path).pipe(res);
   }else if (req.method.toLowerCase() == 'post') {
   	  winston.info("POST method try");
      addNewPaint(req, res);
   }

}).listen(port);

/*
https.createServer(options, (req, res) => {
  console.log('hi');
  if (req.url == '/' && req.method.toLowerCase() == 'get') {
      winston.info("GET method try");
      res.statusCode = 200;
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      res.end(res);
  }else if (req.method.toLowerCase() == 'get' && req.url.indexOf('/image') == 0) {
      winston.info("GET method try");
      var path = __dirname + req.url;
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      fs.createReadStream(path).pipe(res);
  }else if (req.method.toLowerCase() == 'post') {
      winston.info("POST method try");
      addNewPaint(req, res);
  }
}).listen(port);
*/

function addNewPaint(req, res) {
    var form = formidable({ keepExtensions: true  });
    form.uploadDir = uploadDir;

    try{
      form.parse(req, function(err, fields, files) {
          var title = fields.title;
          var image = files.pdf;

          winston.info(image.name);

          if(title == undefined || image == undefined){
          	throw "Exception";
          }
/*
          var date = new Date();

          let month = date.getMonth()+1;
          let day = date.getDate();
          let hour = date.getHours();
          let min = date.getMinutes();
          let sec = date.getSeconds();

          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;
          hour = hour < 10 ? '0' + hour : hour;
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
*/          
          var ext = pathUtil.parse(image.name).ext;
          
          if(ext == ".pdf"){
          	//저장할 pdf 이름 형식 지정
            var newImageName = image.name.replace(".pdf","")/* + date.getFullYear() + month + day + hour + min + sec + String(Math.random()).replace('.','')*/;

            //var newPath = __dirname + '/image/' + newImageName + ext;
  	        var newPath = imageDir + newImageName + ext;
  	        
  	        fs.renameSync(image.path, newPath);
  	        
  	        var url = 'image/' + newImageName + ext;
  	        
  	        var info = {
  	            title : title, image:url
  	        }
            winston.info(url);
            
  	        res.statusCode = 200;
  	        return res.end(url);	
          }else{
          	res.end("");	
          }
      });
    }catch(e){
      winston.info("Exception");
      res.end(e);
    }
}
