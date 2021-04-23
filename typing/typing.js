display = document.getElementById("prompt");
input = document.getElementById("in");

capitalCheck = document.getElementById("capitals");
numberCheck = document.getElementById("numbers");
symbolCheck = document.getElementById("symbols");
uncommonSymbolCheck = document.getElementById("uncommonSymbols");

capitalText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
numbers = "0123456789";
symbols = ",.-()\"?!;:";
uncommonSymbols = "@#$%^&*=[]{}_<>\/\'";

input.focus();

input.addEventListener("keyup",function(event){
    //console.log("event code: " + event.code);
    //console.log("event key: " + event.key);
    if(event.key != "Shift"){
        check();
    }
});

function makeChar() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    if(capitalCheck.checked == true){
        possible += capitalText;
    }
    if(numberCheck.checked == true){
        possible += numbers;
    }
    if(symbolCheck.checked == true){
        possible += symbols;
    }
    if(uncommonSymbolCheck.checked == true){
        possible += uncommonSymbols;
    }
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

function htmlDecode(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

function check(){
    //console.log("display value: " + htmlDecode(display.innerHTML.trim()));
    //console.log("input value: " + input.value.trim());
    if(htmlDecode(display.innerHTML.trim()) === input.value.trim()){
        display.style.color = "#646669";
        input.value = "";
        display.innerHTML = makeChar();
    }else{
        display.style.color = "#FF3C3C";
    }
}
