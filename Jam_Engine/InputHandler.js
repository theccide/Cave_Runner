document.addEventListener('keydown', e => {
    const keyName = e.key;
    if (e.repeat) return;

    let combined = [];

    if (e.ctrlKey) combined.push('ctrl');
    if (e.altKey) combined.push('alt');
    if (e.shiftKey) combined.push('shift');

    getKeyboardInput({type:'down',key:keyName, combined:combined});
});

document.addEventListener('keyup', e => {
    const keyName = e.key;
    getKeyboardInput({type:'up',key:keyName, combined:[]});       
});

// Add the event listeners for mousedown, mousemove, and mouseup
const runClickEvent=e=>{
    if(e.touches) e = e.touches[0];
    const rect = canvas.getBoundingClientRect();    
    let x = (e.clientX - rect.left)
    let y = (e.clientY - rect.top)
    getMouseInput({type:'down',position:{x,y}}); 
};
const runMouseMoveEvent=e=>{
    if(e.touches) e = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left)
    let y = (e.clientY - rect.top)
    getMouseMoveInput({type:'moving',position:{x,y}});
};
const runMouseUpEvent=e=>{
    try{
        if(e.touches) e = e.touches[0];
        const rect = canvas.getBoundingClientRect();    
        let x = (e.clientX - rect.left)
        let y = (e.clientY - rect.top)
        getMouseInput({type:'up',position:{x,y}});  
    }
    catch(err){ // android drag/drop will have e.clientX and e.clientY are undefined
        getMouseInput({type:'up',position:{x:0,y:0}});  
    }
};
canvas.addEventListener('mousedown', e => {runClickEvent(e)});
canvas.addEventListener('mousemove', e => {runMouseMoveEvent(e)});
canvas.addEventListener('mouseup', e => {runMouseUpEvent(e)});          

canvas.addEventListener('touchstart',e => {runClickEvent(e)});
canvas.addEventListener('touchmove',e => {e.preventDefault();runMouseMoveEvent(e);});
canvas.addEventListener('touchend', e => {runMouseUpEvent(e);}); 
canvas.addEventListener('touchcancel', e => {runMouseUpEvent(e);}); 