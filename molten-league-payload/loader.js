(async function loadMoltenLeague(){
  const base='https://raw.githubusercontent.com/essjaykay755/essjaykay-gaming/main/molten-league-payload/';
  const names=['00','01','02','03','04','05'];
  const parts=await Promise.all(names.map(async(name)=>{
    const response=await fetch(base+name+'.txt?v=5488b480',{cache:'no-store'});
    if(!response.ok) throw new Error('Payload '+name+' returned HTTP '+response.status);
    return response.text();
  }));
  const html=atob(parts.join('').replace(/\s/g,''));
  document.open();
  document.write(html);
  document.close();
})().catch((error)=>{
  document.body.innerHTML='<main style="max-width:680px;padding:32px;font:16px system-ui;color:#f8e4bd"><h1>Unable to load Molten League</h1><pre style="white-space:pre-wrap">'+String(error)+'</pre></main>';
});
