var nav=document.querySelector('nav');
async function main() {
  var dir=await fetch("./uploaded/p/");
  dir=await dir.json();
  dir.forEach(i=>{
    let elem=document.createElement('a');
    elem.innerText=i.name.split('.')[0];
    elem.href='./player.html#'+elem.innerText;
    nav.appendChild(elem);
  })
}
main();
function fallback(){
  var name=prompt('playlist name:');
  if(name!==null)location='./edit.html#'+name;
}
