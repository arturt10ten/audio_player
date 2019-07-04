var nav=document.querySelector('nav');
async function main() {
  var dir=await fetch("./uploaded/p/");
  dir=await dir.json();
  dir.forEach(i=>{
    let elem=document.createElement('div');
    let link=document.createElement('a');
    link.innerText=i.name.split('.')[0];
    link.href='./player.html#'+link.innerText;
    elem.appendChild(link);
    let download=document.createElement('img');
    download.src='./res/cloud-computing.svg';
    download.onclick=()=>{
      navigator.serviceWorker.ready.then(async (swReg) => {
        var bgFetch = await swReg.backgroundFetch.get(link.innerText);
        if(bgFetch===undefined){
          var url=`./uploaded/p/${link.innerText}.playlist`
          var list=await fetch(url);
          list=await list.text();
          list=list.split('\n').filter(i=>i);
          var pl=list.map(i=>('./uploaded/'+i));
          try{
            bgFetch=await swReg.backgroundFetch.fetch(link.innerText,
              [
                ...pl,url
              ],
              {
                title: 'downloading',
              }
            );
          }catch(err){
            console.log(err);
          }
        }
      });
    }
    elem.appendChild(download);
    nav.appendChild(elem);
  })
}
main();
function fallback(){
  var name=prompt('playlist name:');
  if(name!==null)location='./edit.html#'+name;
}
