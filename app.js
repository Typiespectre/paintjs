const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const undo = document.getElementById("jsUndo");

const INITIAL_COLOR = "#2c2c2c";

canvas.width = document.getElementsByClassName("canvas")[0].offsetWidth;
canvas.height = document.getElementsByClassName("canvas")[0].offsetHeight;

ctx.fillStyle = "white";
ctx.fillRect(0,0,canvas.width, canvas.height);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

const undoList = [];
const totalUndoList = [];

function stopPainting(){
    painting = false;
    const history = undoList.slice();
    totalUndoList.push(history);
    console.log(totalUndoList);
}

function startPainting(){
    undoList.length = 0;
    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y);
    } else {
        ctx.lineTo(x,y);
        ctx.stroke();
        lastX = x;
        lastY = y;
        if(filling === true){
            undoList.push({
                x: 0,
                y: 0,
                size: 0,
                color: ctx.fillStyle,
                fill: true
            });
        } else {
            undoList.push({
                x: lastX,
                y: lastY,
                size: ctx.lineWidth,
                color: ctx.strokeStyle,
                fill: false
            });  
        }    
    }
}
function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handelModeClick(){
    if(filling === true){
        filling = false;
        mode.innerText = "Fill"
    } else {
        filling = true;
        mode.innerText = "Paint"
    }
}

function handleCanvasClick(){
   if(filling){
        ctx.fillRect(0,0,canvas.width, canvas.height);
    } 
}

function handleContextMenu(event){
    event.preventDefault();
}

function handleSaveClick(){
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS";
    link.click();
}

function undoLast(){
    totalUndoList.pop();
    console.log(totalUndoList);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    totalUndoList.forEach(undo => {
        ctx.beginPath();
        ctx.moveTo(undo[0].x,undo[0].y);
        for(let i = 1; i<undo.length; i++){
            if(!undo[i].fill){
                ctx.lineTo(undo[i].x,undo[i].y);
                ctx.strokeStyle = undo[i].color;
                ctx.lineWidth = undo[i].size;
            } else {
                ctx.fillStyle = undo[i].color;
                ctx.strokeStyle = undo[i].color;
                ctx.lineWidth = undo[i].size;
                ctx.fillRect(0,0,canvas.width, canvas.height);
            }
        }
        ctx.stroke();
    })
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", function(event) {
        painting = false;
    });
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleContextMenu);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
    mode.addEventListener("click", handelModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
}

if(undo){
    undo.addEventListener("click",undoLast);
}