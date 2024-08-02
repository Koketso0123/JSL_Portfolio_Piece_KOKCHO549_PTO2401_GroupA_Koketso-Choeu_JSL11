 // TASK: import helper functions from utils
 import {deleteTask} from './utils/taskFunctions.js'
 import {getTasks} from './utils/taskFunctions.js'
 import {putTask} from './utils/taskFunctions.js'
 // TASK: import initialData
 import {initialData} from './initialData.js'
 
 // *************************************************************************************************************************************************
 //  * FIX BUGS!!!
 //  * **********************************************************************************************************************************************/
 
 // Function checks if local storage already has data, if not it loads initialData to localStorage
 function initializeData() {
   if (!localStorage.getItem('tasks')) {
     localStorage.setItem('tasks', JSON.stringify(initialData)); 
     localStorage.setItem('showSideBar', 'true')
   } else {
     console.log('Data already exists in localStorage');
   }
 }
 initializeData()
 
 const elements = {
   // Sidebar and related elements
   sideBarDiv: document.getElementById('side-bar-div'),
   boardsNavLinksDiv: document.getElementById('boards-nav-links-div'),
   hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
   showSideBarBtn: document.getElementById('show-side-bar-btn'),
   themeSwitch: document.getElementById('switch'),
   filterDiv: document.getElementById('filterDiv'),
 
   // Header elements
   headerBoardName: document.getElementById('header-board-name'),
   addNewTaskBtn: document.getElementById('add-new-task-btn'),
   editBoardBtn: document.getElementById('edit-board-btn'),
   editBoardDiv: document.getElementById('editBoardDiv'),
   deleteBoardBtn: document.getElementById('deleteBoardBtn'),
 
   // Task columns
   todoColumn: document.querySelector('.column-div[data-status="todo"] .tasks-container'),
   doingColumn: document.querySelector('.column-div[data-status="doing"] .tasks-container'),
   doneColumn: document.querySelector('.column-div[data-status="done"] .tasks-container'),
 
   // New task modal elements
   newTaskModalWindow: document.getElementById('new-task-modal-window'),
   titleInput: document.getElementById('title-input'),
   descInput: document.getElementById('desc-input'),
   selectStatus: document.getElementById('select-status'),
   createTaskBtn: document.getElementById('create-task-btn'),
   cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
 
   // Edit task modal elements
   editTaskModalWindow: document.querySelector('.edit-task-modal-window'),
   editTaskForm: document.getElementById('edit-task-form'),
   editTaskTitleInput: document.getElementById('edit-task-title-input'),
   editTaskDescInput: document.getElementById('edit-task-desc-input'),
   editSelectStatus: document.getElementById('edit-select-status'),
   cancelEditBtn: document.getElementById('cancel-edit-btn')
 };
 
 
 let activeBoard = ""
 
 // Extracts unique board names from tasks
 // TASK: FIX BUGS
 function fetchAndDisplayBoardsAndTasks() {
   const tasks = getTasks();
   const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
   displayBoards(boards);
   if (boards.length > 0) {
     const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
     activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
 
     elements.headerBoardName.textContent = activeBoard
     
     styleActiveBoard(activeBoard)
     refreshTasksUI();
   }
 }
 
 // Creates different boards in the DOM
 // TASK: Fix Bugs
 function displayBoards(boards) {
   const boardsContainer = elements.boardsNavLinksDiv;
   boardsContainer.innerHTML = ''; // Clears the container
   boards.forEach(board => {
     const boardElement = document.createElement("button");
     boardElement.textContent = board;
     boardElement.classList.add("board-btn");
     boardElement.addEventListener('click', () => {
 
         elements.headerBoardName.textContent = board;
       
       filterAndDisplayTasksByBoard(board); 
       activeBoard = board; // Assign active board
       localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
       styleActiveBoard(activeBoard);
     });
 
     boardsContainer.appendChild(boardElement);
   });
 }

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  function ensureStatusColumn(columns) {
//   columns.forEach(column => {
//     const status = column.getAttribute("data-status");
//      const status = column.dataset.status
//     if (status) {
//       console.log(`${status.toUpperCase()}`);
//       if (!column.querySelector('.column-head-div')) {
//         column.innerHTML = `<div class="column-head-div">
//                               <span class="dot" id="${status}-dot"></span>
//                               <h4 class="columnHeader">${status.toUpperCase()}</h4>
//                             </div>`;
//       }
//     } else {
//       console.log(`No data-status attribute found for column`);
//     }
//   });
// }

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
// Filters tasks corresponding to the board name and displays them on the DOM.
 // TASK: Fix Bugs
 function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs
  
  [elements.todoColumn, elements.doingColumn, elements.doneColumn].forEach(column => {
     const status = column.dataset.status
    // getAttribute("data-status");
    //  console.log(status)
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                         <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                          
                       </div>`;
    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener('click', () => { 
        openEditTaskModal(task);
        console.log("Task element has been clicked")
      });


      tasksContainer.appendChild(taskElement);
    });
  });
}
 function refreshTasksUI() {
   filterAndDisplayTasksByBoard(activeBoard);
 }
 
 // Styles the active board by adding an active class
 // TASK: Fix Bugs
 function styleActiveBoard(boardName) {
   document.querySelectorAll('.board-btn').foreach(btn => { 
     
     if(btn.textContent === boardName) {
       btn.classList.add('active') 
     }
     else {
       btn.classList.remove('active'); 
     }
   });
 }
 
 
 function addTaskToUI(task) {
   const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
   if (!column) {
     console.error(`Column not found for status: ${task.status}`);
     return;
   }
 
   let tasksContainer = column.querySelector('.tasks-container');
   if (!tasksContainer) {
     console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
     tasksContainer = document.createElement('div');
     tasksContainer.className = 'tasks-container';
     column.appendChild(tasksContainer);
   }
 
   const taskElement = document.createElement('div');
   taskElement.className = 'task-div';
   taskElement.textContent = task.title; // Modify as needed
   taskElement.setAttribute('data-task-id', task.id);
   
   tasksContainer.appendChild(taskElement); 
 }
 
 
 
 function setupEventListeners() {
   // Cancel editing task event listener
   // const cancelEditBtn = document.getElementById('cancel-edit-btn');
   elements.cancelEditBtn.addEventListener('click' , () => toggleModal(false, elements.editTaskModalWindow));
 
   // Cancel adding new task event listener
   // const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
   elements.cancelAddTaskBtn.addEventListener('click', () => {
     toggleModal(false, elements.newTaskModalWindow);
     elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
   });
 
   // Clicking outside the modal to close it
   elements.filterDiv.addEventListener('click', () => {
     toggleModal(false,elements.newTaskModalWindow);
     elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
   });
 
   // Show sidebar event listener
   elements.hideSideBarBtn.addEventListener('click' , () => toggleSidebar(false));
   elements.showSideBarBtn.addEventListener('click' , () => toggleSidebar(true));
 
   // Theme switch event listener
   elements.themeSwitch.addEventListener('change', toggleTheme);
 
   // Show Add New Task Modal event listener
   elements.addNewTaskBtn.addEventListener('click', () => {
     toggleModal(true, elements.newTaskModalWindow);
     elements.filterDiv.style.display = 'block'; // Also show the filter overlay
   });
 
   // Add new task form submission event listener
   elements.newTaskModalWindow.addEventListener('submit',  (event) => {
     event.preventDefault();
     addTask(event)
   });
 }
 
 // Toggles tasks modal
 // Task: Fix bugs
 function toggleModal(show, modal) {
   modal.style.display = show ? 'block' : 'none'; 
 }

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      id: Date.now(), 
    title: elements.titleInput.value,
    description: elements.descInput.value,
    status: elements.selectStatus.value,
    board: activeBoard
  };

    ;
      const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  addTaskToUI(task);
      toggleModal(false, elements.newTaskModalWindow);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }



function toggleSidebar(show) {

  elements.sideBarDiv.style.display = show ? 'block' : 'none';
  elements.showSideBarBtn.style.display = show ? 'none' : 'block';
  localStorage.setItem('showSideBar', show.toString());
}

function toggleTheme() {
 const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  
  document.body.classList.toggle('dark-theme', currentTheme === 'light');
  document.body.classList.toggle('light-theme', currentTheme === 'dark');
  localStorage.setItem('light-theme', currentTheme === 'light' ? 'disabled' : 'enabled');
}



function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskTitleInput.value = task.title || '';
  elements.editTaskDescInput.value = task.description || '';
  elements.editSelectStatus.value = task.status || '';

  // Get button elements from the task modal

  const saveTaskChangesBtn = document.getElementById('save-task-changes-btn')
  const deleteTaskBtn = document.getElementById('delete-task-btn')

  // Call saveTaskChanges upon click of Save Changes button
  saveTaskChangesBtn.onclick = () => {
    saveTaskChanges(task.id);
  };

  // Delete task using a helper function and close the task modal
  
    deleteTaskBtn.addEventListener('click', () => {
      deleteTask(task.id); 
      toggleModal(false, elements.editTaskModalWindow);
      refreshTasksUI()
    });
  


  toggleModal(true, elements.editTaskModalWindow); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTitle = elements.editTaskTitleInput.value;
  const updatedDescription = elements.editTaskDescInput.value;
  const updatedStatus = elements.editSelectStatus.value;

  // Create an object with the updated task details

  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

    tasks[taskIndex] = {
      ...tasks[taskIndex],
    id: taskId,
    title: updatedTitle || '',
    description: updatedDescription || '',
    status: updatedStatus || ''
  };


  // Update task using a hlper functoin
  putTask(id, updatedTask)

  // Close the modal and refresh the UI to reflect the changes
 toggleModal(false, elements.editTaskModalWindow);
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
} 