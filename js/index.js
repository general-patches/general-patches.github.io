var data = null;
var filled = false;

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
            if(filled == true){
                for(var i = 0; i < 1; i++){
                    removeElement("canvas_container" + i);
                } 
            }
            update(document.getElementById("countryCode").value);
            document.getElementById("countryCode").value = "";
        }else{
            alert("Please Enter a country code")
        }
    }
}

var iconLoad = setInterval(rotate,10);
var deg = 0;
function rotate(){
    if(deg > 359){
        deg = 0;
    }
    document.getElementById("icon").style.transform = "rotate("+deg+"deg)";
    deg += 3;
}

function load(bool){
    var icon = document.getElementById("icon");
    if(bool == true){
        icon.style.border = "10px solid black";
        icon.style.height = "50px";
        icon.style.borderTopColor = "white";    
    }else{
        icon.style.border = "0px solid black";
        icon.style.height = "0px";
    }
}

async function update(countryCode = "ZA"){
    var url = "https://thevirustracker.com/free-api?countryTimeline=" + countryCode;
    let promise = new Promise(function(resolve, reject){
        getData(url,resolve);
    });
    await promise;
    
    load(false);
    for(var i = 0; i < 1; i++){
        filled = true;
        var app = document.getElementById("body_container");
        var canvasContainer = document.createElement("div");
        canvasContainer.setAttribute("class","canvas_container");
        canvasContainer.setAttribute("id","canvas_container" + i);
        app.appendChild(canvasContainer);
        canvasContainer.innerHTML = '<canvas id="canvas' + i + '" style="border: 2px solid black;background-color: white;border-radius: 4px;padding: 10px;" width="1020" height="720">';
    } 

    drawBarGraph("canvas" + 0);
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
    
    x_adjust = 1020/x_values[(Object.keys(data).length-3)];
    y_adjust = 720/maxY;
    
    ctx.save();
    ctx.moveTo(0, 720);
    ctx.lineWidth = 3;
    for(var i = 0; i < (Object.keys(data).length-2); i++){
        y_values[i] = y_values[i]*y_adjust;
        ctx.lineTo(x_values[i]*x_adjust,(720-y_values[i]));
        //(1-(y_values[i]/maxY))*maxY
    }
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

