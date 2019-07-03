var nav=document.querySelector('nav');
var filer=document.querySelector('input');
var zzz=document.querySelector('header>span');
var url;
filer.onchange=function(){
  zzz.style.display='none';
  console.dir([...filer.files]);
  Promise.all([...filer.files].map(async i=>{
    var data=new FormData();
    data.append('file',i);
    data.append('p',`${url}/${i.name}`);
    let z=fetch('./upload/add',{
      method:'post',
      body:data
    });
    try{
      await z;
    }
    catch(err){}
    return;
  })).then(main);
}
function mkdir(){
  zzz.style.display='none';
  var data=new FormData();
  data.append('p',`${url}/${prompt('dir name:')}`);
  fetch('./upload/dir',{
    method:'post',
    body:data
  }).then(main);
}
async function main(){
  if(!location.hash)return;
  zzz.style.display='block';
  url=decodeURI(location.hash.substring(1));
  var dir=await fetch('uploaded/'+url);
  dir=await dir.json();
  nav.innerHTML='';
  dir.forEach(i=>{
    var elem;
    if(i.type=='file'){
      elem=document.createElement('div');
      elem.innerText=i.name;
      elem.onclick=()=>{
        window.parent.postMessage(location.hash+'/'+encodeURI(i.name),'*');
      }
    }
    else{
      elem=document.createElement('a');
      elem.innerText=i.name+'/';
      elem.href=location.hash+'/'+encodeURI(i.name);
    }
    nav.appendChild(elem);
  })
}
window.onhashchange=main;
main();
