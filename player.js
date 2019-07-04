if(!location.hash)location='./index.html'
var url=decodeURI(location.hash.substring(1));
var audio=new Audio();
var prog=document.querySelector('#pb>*');
var nav=document.querySelector('nav');
var marker=document.createElement('span');
var loader=document.querySelector('#loader');
audio.set=function(data){
  this.cr=data;
  this.cr.elem.insertBefore(marker,this.cr.elem.firstChild);
  this.src=data.url;
  loader.href=data.next.url;
  this.currentTime=0;
  audio.play();
}
audio.go_next=function(){
  this.set(this.cr.next);
}
audio.go_back=function(){
  this.set(this.cr.prev);
}
audio.addEventListener('ended',()=>{
  audio.go_next();
});
audio.addEventListener('timeupdate',()=>{
  prog.style.width=`${100*audio.currentTime/audio.duration}%`;
});
function play(){
  audio.play();
}
function pause(){
  audio.pause();
}
function stop(){
  audio.pause();
  audio.currentTime=0;
}
function next(){
  audio.go_next();
}
function back(){
  audio.go_back();
}
if(navigator.mediaSession){
  navigator.mediaSession.setActionHandler('nexttrack', function() {
    audio.go_next();
  });
  navigator.mediaSession.setActionHandler('previoustrack', function() {
    audio.go_back();
  });
  navigator.mediaSession.setActionHandler('play', function() {
    audio.play();
  });
  navigator.mediaSession.setActionHandler('pause', function() {
    audio.pause();
  });
}
async function main() {
  var list=await fetch(`./uploaded/p/${url}.playlist`);
  list=await list.text();
  list=list.split('\n').filter(i=>i);
  var pl=list.map(i=>({url:'./uploaded/'+i,elem:document.createElement('div')}));
  console.log(pl);
  pl.reduce((i,j)=>{
    i.next=j;
    j.prev=i;
    return j;
  });
  pl[0].prev=pl[pl.length-1];
  pl[pl.length-1].next=pl[0];
  nav.innerHTML='';
  pl.forEach(i=>{
    nav.appendChild(i.elem);
    let elem=document.createElement('span');
    elem.innerText=decodeURI(i.url.split('/').pop());
    i.elem.appendChild(elem);
    i.elem.onclick=()=>{
      audio.set(i);
    }
  });
  audio.set(pl[0]);
}
main();
