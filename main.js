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
let taskDate =document.getElementById("task-date");
let taskList = [];
let boardStatus = [];
let board="all-board";
let timerSet = false;

const sysDate = new Date();
console.log("프로그래스를 위해 과거 날짜기준으로 할일 추가 날짜가 설정 되도록 해놓았습니다");
for(let i=0;i<tabs.length;i++){
    tabs[i].addEventListener("click",function(e){
        filter(e)
    });
}

taskInput.addEventListener("focus",(e)=>{
    document.getElementById("alert").style.visibility="hidden";
    e.target.style.backgroundColor="lightGray";
    setTimeout(()=>{
        e.target.style.backgroundColor="white"
    },100);
});

addButton.addEventListener("click",addTask);
taskInput.addEventListener("keydown",function(e){
    if(e.key === "Enter" && !timerSet){
        timerSet=true;
        setTimeout(()=>{
            addTask();
            timerSet = false;
        },100);
    };
});
resetButton.addEventListener("click",resetTask);

function addTask(){
    if(taskInput.value==null||taskInput.value.trim()==""){
        document.getElementById("alert").style.visibility="visible";
        return;
    }else{
        let task ={
            id: randomId(),
            taskContent: taskInput.value,
            isComplete: false,
            isModify : false,
            isDate : "2024-01-15", //프로그래스 적용 확인을 위해 과거 날짜 설정 > isDate() 함수 호출시 제대로 작동함
            isDoneDate : taskDate.value,
            isProgress : ""
        }
        task.isProgress = Math.round((Progress(task.isDate,task.isDoneDate)));
        if(isNaN(task.isProgress)){
            task.isProgress="목표일 미설정";
        }else if(task.isProgress>100){
            task.isProgress="100%";
        }else{
            task.isProgress=task.isProgress+"%";
        }
        taskList.push(task);
        filter();
    }
    document.getElementById("alert").style.visibility="hidden";
    taskInput.value="";
    taskDate.value="";
}

function Progress(isDate,isDoneDate){
    isDate = new Date(isDate);
    isDoneDate = new Date(isDoneDate);
    if(isDate instanceof Date&&isDoneDate instanceof Date){
        let isTime = Math.abs(isDoneDate.getTime() - isDate.getTime());
        let sysTime = Math.abs(sysDate.getTime() - isDate.getTime());
        let timeProgress = (sysTime/isTime)*100;
        return timeProgress;
    }else{
        return 0;
    }
}

function isDate(a){
    if(!a){
        a = new Date();
    }
    let isDate = new Date(a);
    let year = isDate.getFullYear();
    let month = String(isDate.getMonth()+1);
    let date = String(isDate.getDate());

    return `${year}-${month}-${date}`;
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
            resultHTML+=
            `<div class="task" id="${list[i].id}" draggable="true">
                <div class="tasks">
                    <div class="task-done task-content">${list[i].taskContent}</div>
                    <div class="date-progress">
                        <div class="progress">
                            <div id="progress${list[i].id}" class="progressResult" style="width: ${list[i].isProgress}">${list[i].isProgress}</div>
                        </div>
                        <div class="date";">${list[i].isDoneDate}</div>
                    </div>
                </div>
                <div class="task-button">
                    <button class="btn btn-light" onclick="modi('${list[i].id}')" disabled>
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-light return" onclick="toggleComplete('${list[i].id}')" title="되돌리기">
                        <i class="fa-solid fa-rotate-left"></i></button>
                    <button class="btn btn-light delete" onclick="deleteTask('${list[i].id}')" title="지우기">
                    <i class="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>`;
        }else{
            resultHTML +=
            `<div class="task" id="${list[i].id}" draggable="true">
                <div class="tasks">
                    <div class="task-content">${list[i].taskContent}</div>
                    <div class="date-progress">
                        <div class="progress">
                            <div id="progress${list[i].id}" class="progressResult" style="width: ${list[i].isProgress}">${list[i].isProgress}</div>
                        </div>
                        <div class="date" onclick="editDate('${list[i].id}');">${list[i].isDoneDate}</div>
                    </div>
                </div>
                <div class="task-button">
                    <button class="btn btn-light" onclick="modi('${list[i].id}')" title="수정하기">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-light check" onclick="toggleComplete('${list[i].id}')" title="완료하기">
                        <i class="fa-solid fa-circle-check"></i>
                    </button>
                    <button class="btn btn-light delete" onclick="deleteTask('${list[i].id}')" title="지우기">
                    <i class="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>`;
        }
    }
    document.getElementById("sortable-list").innerHTML = resultHTML;
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

function editDate(id){
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            let editCheck=true;
            while(editCheck){
                let dateCheck = taskList[i].isDoneDate=="" ? isDate() : taskList[i].isDoneDate;
                let editDate = prompt("날짜를 수정하세요",`${dateCheck}`);
                if(editDate==null){
                    editDate=taskList[i].isDoneDate;
                    editCheck=false;
                }else if(editDate.trim()==""){
                    editDate=taskList[i].isDoneDate;
                    editCheck=false;
                }else{
                    editDate = new Date(editDate);
                    if(isNaN(editDate)){
                        editDate = prompt("올바른 날짜 형식을 입력하세요",`${dateCheck}`);
                        if(editDate==null){
                            editDate=taskList[i].isDoneDate;
                            editCheck=false;
                        }else if(editDate.trim()==""){
                            editDate=taskList[i].isDoneDate;
                            editCheck=false;
                        }else{
                            break;
                        }
                    }else{
                        taskList[i].isDoneDate = isDate(editDate);
                        editCheck=false;
                    }
                }
            }
            taskList[i].isProgress = Math.round((Progress(taskList[i].isDate,taskList[i].isDoneDate)));
            if(isNaN(taskList[i].isProgress)){
                taskList[i].isProgress="목표일 미설정";
            }else if(taskList[i].isProgress>100){
                taskList[i].isProgress="100%";
            }else{
                taskList[i].isProgress=taskList[i].isProgress+"%";
            }
        }
    }
    filter();
};

function modi(id){
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].id==id){
            //프롬프트 입력 내용에 따라 while함수로 사용자의 UX 고려
            let modiCheck=true;
            while(modiCheck){
                let modi = prompt("수정내용을 입력하세요",`${taskList[i].taskContent}`);
                if(modi==null){
                    modiCheck = false;
                }else if(modi.trim()===""){
                    modiCheck = !confirm("내용을 입력해야 수정됩니다. 수정을 취소하시겠습니까?");
                }else{
                    taskList[i].taskContent = modi;
                    modiCheck=false;
                }
            }
        }
    }
    filter();
}

function filter(e){
    if(e){
        board=e.target.id;
        underline.style.left = e.currentTarget.offsetLeft + "px";
        underline.style.width = e.currentTarget.offsetWidth + "px";
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

const item = document.querySelector(".list");
//드래그가 시작될때 이벤트 위임으로 대상 엘리먼트를 찾는 로직 적용(div를 드래그하기 위해서 div에 draggable="true" 속성 부여)
item.addEventListener("dragstart",(e)=>{
    if(e.target.classList.contains("task")){
        draggedTask = e.target;
        //드래그 중인 엘리먼트에 클래스를 추가하여 css 적용
        e.target.classList.add("dragging");
        //드래그되어 이동하는 엘리먼트의 데이터를 저장하기 위한 메서드들을 사용
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain",draggedTask.id);
    }
})

//드래그가 완료되어 드랍될때 발생하는 이벤트
item.addEventListener("dragend",(e)=>{
    e.target.classList.remove("dragging");
    draggedTask=null;

    //taskList를 드래그엔드랍으로 변경된 리스트로 재배열하는 로직 > 랜더링 시 드래드앤드랍으로 변경된 순서 초기화 방지
    const newTaskList = [];
    const tasks = item.querySelectorAll(".task");
    tasks.forEach(function(task){
        const taskId = task.getAttribute("id");
        const taskOBJ = taskList.find(function(item){
            return item.id===taskId
        });
        newTaskList.push(taskOBJ);
    });
    
    taskList = newTaskList;
    render();
})

// 드래그오버 이벤트 리스너 >> 드래그된 대상이 호버될때 발생
item.addEventListener("dragover",function(e){
    e.preventDefault();
    if(e.target.classList.contains("task")){
        // 마우스위치와 가장 가까운 엘리먼트를 찾는 함수(대상 엘리먼트, Y좌표)
        const afterElement = getDragAfterElement(item, e.clientY);
        // 드래그중인 draggedTask의 아이디로 엘리먼트를 찾아서 변수 초기화
        const taskBeingDragged = document.getElementById(draggedTask.id);
        // 가장가까운 위치의 엘리먼트를 기준으로 추가하는 로직(없으면 맨아래로, 있으면 대상 엘리먼트 위로)
        if (afterElement == null) {
            item.appendChild(taskBeingDragged);
        } else {
            item.insertBefore(taskBeingDragged, afterElement);
        }
    }
});

function getDragAfterElement(container, y) {
    //.task 중 .dragging 제외한 엘리먼트를 배열에 저장
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    //배열에 저장된 엘리먼트 중에서 reduce메서드로 마우스 위치를 기준으로 가장가까운 엘리먼트 위치를 반환
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}



function randomId(){
    return '_' + Math.random().toString(36).substring(2,9);
}

function resetTask(){
    if(confirm("정말 할일을 초기화 하시겠습니까?")){
        taskList = [];
        document.getElementById("sortable-list").innerHTML = "";
    }
}
