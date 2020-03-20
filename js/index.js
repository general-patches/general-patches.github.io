var data = null;
const canvasWidth = 1000;
const canvasHeight = 700;
const canvasPadding = 50;

/*
ctx.save();
ctx.beginPath();
ctx.moveTo(0, 600);
ctx.lineTo(400,400);
ctx.stroke();
ctx.restore();
ctx.beginPath();
ctx.fillStyle = "#4d4d4d";
ctx.fillRect(20,20,100,400);
ctx.save();
*/


function changeCountry(event){
    if(event.keyCode == 13){
        load(true);
        if(document.getElementById("countryCode").value != ""){
            if(document.getElementById("canvas_container0") != null){
                removeElement("canvas_container0");
                removeElement("container_heading0");
            }
            update(document.getElementById("countryCode").value);
            document.getElementById("countryCode").value = "";
        }else{
            alert("Please Enter a country code")
        }
    }
}
var deg = 0;
var iconLoad;

async function load(bool){
    var icon = document.getElementById("icon");
    if(bool == true){
        iconLoad = setInterval(rotate,10);
        icon.style.border = "10px solid black";
        icon.style.height = "50px";
        icon.style.borderTopColor = "white";
    }else{
        icon.style.border = "0px solid black";
        icon.style.height = "0px";
        clearInterval(iconLoad);
    }
}

function rotate(){
    if(deg > 359){
        deg = 0;
    }
    document.getElementById("icon").style.transform = "rotate("+deg+"deg)";
    deg += 3;
}

async function update(countryCode = "ZA"){
    var url = "https://cors-anywhere.herokuapp.com/https://thevirustracker.com/free-api?countryTimeline=" + countryCode;
    let promise = new Promise(function(resolve, reject){
        getData(url,resolve);
    });
    await promise;
    
    load(false);
    insertDataArea("0");
    drawBarGraph("canvas0");
}

function insertDataArea(name){
    var app = document.getElementById("body_container");
    var div = document.createElement("div");
    div.setAttribute("class","container_heading");
    div.setAttribute("id","container_heading" + name);
    app.appendChild(div);
    div.innerHTML = "<h1 style='padding-bottom:10px;'>Cumulative cases</h1>";
    var canvasContainer = document.createElement("div");
    canvasContainer.setAttribute("class","canvas_container");
    canvasContainer.setAttribute("id","canvas_container" + name);
    app.appendChild(canvasContainer);
    canvasContainer.innerHTML = '<canvas id="canvas' + name + '" style="border: 2px solid black;background-color: white;border-radius: 4px;" width="'+canvasWidth+'" height="'+canvasHeight+'">';
}

function drawBarGraph(canvasID){
    var x_values = [];
    var y_values = [];
    var c = document.getElementById(canvasID);
    var ctx = c.getContext("2d");
    var maxY = 0;

    for(var i = 0; i < (Object.keys(data).length-2); i++){
        x_values.push(i);
        y_values.push(data[Object.keys(data)[i]]["total_cases"]);
        if(y_values[i] > maxY){
            maxY = y_values[i];
        }
    }
    
    x_adjust = (canvasWidth-2*canvasPadding)/x_values[(Object.keys(data).length-3)];
    y_adjust = (canvasHeight-2*canvasPadding)/maxY;
    
    ctx.save();
    ctx.moveTo(canvasPadding, canvasHeight-canvasPadding);
    ctx.lineWidth = 3;
    for(var i = 0; i < (Object.keys(data).length-2); i++){
        y_values[i] = y_values[i]*y_adjust;
        x_values[i] = x_values[i]*x_adjust;
        ctx.lineTo(x_values[i]+canvasPadding,(canvasHeight-y_values[i])-canvasPadding);
        //(1-(y_values[i]/maxY))*maxY
    }
    ctx.stroke();
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillText("Time",canvasWidth/2,canvasHeight-canvasPadding/2.5);
    ctx.fillText(maxY,canvasPadding/2,canvasPadding+8);
    ctx.lineWidth = 1;
    ctx.moveTo(canvasPadding/2+60,canvasPadding);
    ctx.lineTo(canvasWidth-canvasPadding,canvasPadding);
    ctx.stroke();
    ctx.restore();
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function getData(url,resolve){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            try{
                data = JSON.parse(this.response);
            }catch(e){

            }
            if(data["timelineitems"] == null){
                alert("Please enter a valid country code");
                return;
            }
            data = data["timelineitems"][0];
            //console.log(data);
            //console.log(Object.keys(data).length);
            //console.log(data[Object.keys(data)[55]]);
            //console.log("Done getting data");
            resolve();
        }
    }
    request.open("Get",url,"true");
    request.send();
}

