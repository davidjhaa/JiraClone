let colors = ["lightpink", "lightgreen", "lightblue", "black"];
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let modalPriorityColor = colors[colors.length - 1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont")

let isModalPresent = false;
addBtn.addEventListener('click',function(){
    if(!isModalPresent){
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
})

const allPriorityColors = document.querySelectorAll(".priority-color");

allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener("click",function(){
        allPriorityColors.forEach(function (priorityColorElem) { //this line will check every prioritycolor element and whichever contain active class it will remove from there
            priorityColorElem.classList.remove("active");
        })
        colorElement.classList.add("active");
        modalPriorityColor = colorElement.classList[0];
    })
});

modalCont.addEventListener("keydown", function(e){
    let key = e.key;
    if(key == "Shift"){
        console.log(modalPriorityColor);
        console.log(textAreaCont.value);
        createTicket(modalPriorityColor, textAreaCont.value);
        modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
    }
});

function createTicket(ticketColor, data){
    let ticketCont = document.createElement("div");  //<div><\div>
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id"></div>
        <div class="task-area">${data}</div>
        </div>
    `
    mainCont.appendChild(ticketCont);
}
