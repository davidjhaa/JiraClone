let uid = new ShortUniqueId();

let colors = ["lightpink", "lightgreen", "lightblue", "black"];
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let modalPriorityColor = colors[colors.length - 1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");
let ticketCont = document.querySelectorAll(".ticket-cont");
let removeBtn = document.querySelector(".remove-btn")
let ticketsArr = [];

// to open and close modal conatiner
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

//to remove and add active class from each priority color of modal container
allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener("click",function(){
        allPriorityColors.forEach(function (priorityColorElem) { //this line will check every prioritycolor element and whichever contain active class it will remove from there
            priorityColorElem.classList.remove("active");
        })
        colorElement.classList.add("active");
        modalPriorityColor = colorElement.classList[0];
    })
});

// to create and display ticket
modalCont.addEventListener("keydown", function(e){
    let key = e.key;
    if(key == "Shift"){
        console.log(modalPriorityColor);
        console.log(textAreaCont.value);
        createTicket(modalPriorityColor, textAreaCont.value);
        modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function (colorElem) {
            colorElem.classList.remove("active");
        });
    }
});

// function to create new ticket
function createTicket(ticketColor, data, ticketId){
    let id = ticketId || uid();
    let ticketCont = document.createElement("div");  //<div><\div>
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    // attaching event listener to all ticket conatainer as soon as it is created
    handleRemoval(ticketCont, id);

    // attaching event listener to change priority of
    handleColor(ticketCont, id);

    //if ticket is being created for the first time , then ticketId would be undefined
        if (!ticketId) {
        ticketsArr.push(
            {
                ticketColor,
                data,
                ticketId: id
            }
        );
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }
}

// get all ticket from local storage and display on browser
if(localStorage.getItem("tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
    })
}

// filter tickets on the basis of ticketcolor
for(let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", function(){
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter(function (ticketObj) {
            if (currToolBoxColor == ticketObj.ticketColor) 
                return ticketObj;
            // return currToolBoxColor == ticketObj.ticketColor;
        });

        // to remove all the tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        // display filtered tickets
        filteredTickets.forEach( function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
        })
    })

    // to display all the tickets of all colors on double clicking
    toolBoxColors[i].addEventListener("dblclick", function () {
      
        // remove all the color specific tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove();
        }

    //   display all Tickets
      ticketsArr.forEach(function (ticketObj) {
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
      });
    });
}

// on clicking remove btn make it red and make it white on again clicking on it
let removeBtnActive = false;
removeBtn.addEventListener("click", function(){
    if(removeBtnActive){
        removeBtn.style.color = "white";
    }
    else{
        removeBtn.style.color = "red";
    }
    removeBtnActive = !removeBtnActive;
})

// remove ticket from local store and UI
function handleRemoval(ticket, id){
    ticket.addEventListener("click", function(){
        if(!removeBtnActive) return;

        //local storage se removal
        // ->get idx of the ticket to be deleted 
        let idx = getTicketIdx(id);
        // ->delete from ticketsArr (which was created globally)
        ticketsArr.splice(idx, 1);  //first arg kahan se delte karna h and 2nd arg kitna delete karna h

        // remove from browser storage and update local storage
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));

        // finally remove from frontend
        ticket.remove();
    });
}

// return index of ticket is to be deleted
function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketId == id;
    });
    return ticketIdx;
}

// change priority of color of any ticket container
function handleColor(ticket, id){
    let ticketColorStrip = ticket.querySelector(".ticket-color");

    ticket.addEventListener("click", function(){
        let currTicketColor = ticketColorStrip.classList[1];
        // ["lightpink", "lightgreen", "lightblue", "black"]
        let currTicketColorIdx = colors.indexOf(currTicketColor);

        let newTicketColorIdx = currTicketColorIdx+1;
        newTicketColorIdx = newTicketColorIdx % 4;

        let newTicketColor = colors[newTicketColorIdx];

        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        // local storage me update 
        let ticketIdx = getTicketIdx(id);
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    })
}






