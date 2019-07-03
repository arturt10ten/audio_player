var main=document.querySelector('main');
var url=decodeURI(location.hash.substring(1));
window.addEventListener('message',function(e){
  console.log(e);
  create_my_element(e.data.slice(1));
});
function create_my_element(name_){
  var elem=document.createElement('div');
  var name=document.createElement('span');
  var img=document.createElement('img');
  elem.appendChild(name);
  elem.appendChild(img);
  main.appendChild(elem);
  name.innerText=decodeURI(name_);
  img.src='./res/rubbish-bin.svg';
  img.onclick=()=>{
    elem.remove();
  }
}
function save() {
  var a=[...document.querySelectorAll('main>div>span')].map(i=>encodeURI(i.innerText)).join('\n');
  var data=new FormData();
  data.append('file',new Blob([a],{type:'text/plain'}));
  data.append('p',`p/${url}.playlist`);
  const s=()=>{
    location='./';
  };
  fetch('./upload/add',{
    method:'post',
    body:data
  }).then(s)
  .catch(s);
}
async function fmain(){
  let list=await fetch(`./uploaded/p/${url}.playlist`);
  if(list.status!=200)return;
  list=await list.text();
  list=list.split('\n').filter(i=>i);
  list.forEach(i=>{
    create_my_element(i);
  });
}
fmain();
