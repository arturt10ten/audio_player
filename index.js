const http = require('http');
const url = require('url');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');


async function get_param(req,res) {
  var ask=url.parse(req.url,true);
  if(req.method == 'POST'){
    var form = new formidable.IncomingForm();
    form.maxFileSize = 200 * 1024 * 1024;
    form.uploadDir = './tmp';
    return await new Promise(function (res,rej){
      form.on('aborted', function() {
        console.log('connection lost');
        rej("connection lost");
      });
      form.on('error',(err)=>{
        console.log(err);
        console.log('error_found');
        rej(err);
      });
      form.parse(req,function(err,fields,files){
        if(err)rej(err);
        else res({
          url:req.url,
          files:files,
          param:fields,
          path:path.normalize(ask.pathname),
        });
      });
    });
  }
  if(req.method == 'GET'){
    return {
      url:req.url,
      param:{...ask.query},
      path:path.normalize(ask.pathname),
    };
  }
}
async function http_server_handler(req,res){
  var r=await get_param(req,res);
  console.log(r);
  var p='uploaded'+path.normalize(`/${r.param.p}`);
  switch (r.path){
    case '/upload/add':
      try{
        await fs.promises.unlink(p);
        await fs.promises.unlink(p+'.meta');
      }
      catch(err){}
      await fs.promises.rename(r.files.file.path,p);
      res.end();
    break;
    case '/upload/del':
      try{
        await fs.promises.unlink(p);
        await fs.promises.unlink(p+'.meta');
      }
      catch(err){}
      res.end();
    break;
    case '/upload/dir':
      try{
        await fs.promises.mkdir(p);
      }catch(err){}
      res.end();
    break;
  }
}
http.createServer(http_server_handler).listen(5000);
