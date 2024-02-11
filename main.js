//유저가 값을 입력한다.
//+ 버튼을 클릭하면 할일이 추가된다
//delete 버튼을 누루면 할일이 삭제된다
//check 버튼을 누르면 취소선이 생긴다
// 1. check 버튼을 클릭하면 isComplete > false
// 2. true이면 끝난걸로 인식하고 밑줄
// 3. false면 안끝난걸로 인식하고 그대로
//진행중 끝남 탭을 누르면, 언더바가 이동한다.
//끝남탭은, 끝난 아이템만, 진행중 텝은 진행중인것만 나온다.
//전테텝을 누르면 전테아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let resetButton = document.getElementById("reset-button");
let tabs = document.querySelectorAll(".tabs");
let underline = document.getElementById("under-line");
let taskList = [];
let boardStatus = [];
let board="all-board";

for(let i=0;i<tabs.length;i++){
    tabs[i].addEventListener("click",function(e){
        filter(e)
    });
}
console.log(tabs);

addButton.addEventListener("click",addTask);
taskInput.addEventListener("keyup",function(e){
    if(e.key === "Enter"){
        addTask();
    };
});
resetButton.addEventListener("click",resetTask);

function addTask(){
    if(taskInput.value!==""&&taskInput.value.length<21){
        let task ={
            id: randomId(),
            taskContent: taskInput.value,
            isComplete: false
        }
        taskList.push(task);
        render();
    }else{
        alert("내용이 없거나 내용이 너무 깁니다");
    }
    taskInput.value="";
}

function render(){
    let resultHTML ="";
    let list=[];
    if(board==="all-board"){
        list = taskList;
    }else{
        list = boardStatus;
    }
    for(let i=0;i<list.length;i++){
        if(list[i].isComplete==true){
            resultHTML+=`<div class="task"><div class="task-done task-content">${list[i].taskContent}</div><div class="task-button"><button class="btn btn-light return" onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button><button class="btn btn-light delete" onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-eraser"></i></button></div></div>`;
        }else{
            resultHTML += `<div class="task"><div class="task-content">${list[i].taskContent}</div><div class="task-button"><button class="btn btn-light check" onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-circle-check"></i></button><button class="btn btn-light delete" onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-eraser"></i></button></div></div>`;
        }
    }
    document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id){
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    filter();
}

function deleteTask(id){
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            taskList.splice(i,1);
            break;
        }
    }
    filter();
}

function filter(e){
    if(e){
        board=e.target.id;
        underline.style.left = e.currentTarget.offsetLeft +8 + "px";
        underline.style.width = e.currentTarget.offsetWidth -16 + "px";
        underline.style.top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight -2 + "px";
    }
    
    boardStatus=[];
    if(board==="on-board"){
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete === false){
                boardStatus.push(taskList[i]);
            }
        }
    }else if(board==="done-board"){
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete === true){
                boardStatus.push(taskList[i]);
            }
        }
    }
    render();
}

function randomId(){
    return '_' + Math.random().toString(36).substring(2,9);
}

function resetTask(){
    taskList = [];
    document.getElementById("task-board").innerHTML = "";
}