//Initial References
const newTaskInput = document.querySelector('#new-task input');
const tasksDiv = document.querySelector('#tasks');
let deleteTasks, editTasks, tasks;
let updateNote = '';
let count;

//Function on window load
window.onload = () => {
    updateNote = '';
    count = Object.keys(localStorage).length;
    displayTasks();
}

//Function to display tasks
const displayTasks = () => {
    if(Object.keys(localStorage).length > 0){
        tasksDiv.style.display = 'inline-block';
    } else {
        tasksDiv.style.display = 'none';
    }

    //Clear the tasks
    tasksDiv.innerHTML = '';

    //Fetch all the keys in local storage
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort();

    for(let key of tasks){
        let value = localStorage.getItem(key);
        let taskInnerDiv = document.createElement('div');
        taskInnerDiv.classList.add('task');
        taskInnerDiv.setAttribute('id', key);
        taskInnerDiv.innerHTML = `<span id='taskname'>${key.split('_')[1]}</span>`;
        
        let editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        taskInnerDiv.appendChild(editButton);
        
        taskInnerDiv.innerHTML += `<button class='delete'><i class="fa-solid fa-trash"></i></button>`;
        tasksDiv.appendChild(taskInnerDiv);
    }

    //Edit tasks
    editTasks = document.getElementsByClassName('edit');
    Array.from(editTasks).forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            disableButtons(true);
            let parent = element.parentElement;
            newTaskInput.value = parent.querySelector('#taskname').innerText;
            updateNote = parent.id;
            parent.remove();
        });
    });

    //Delete tasks
    deleteTasks = document.getElementsByClassName('delete');
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            let parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
            count -= 1;
        });
    });
};

//Disable edit button
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName('edit');
    Array.from(editButtons).forEach(element =>{
        element.disabled = bool;
    });
};

//Remove task from local storage
const removeTask = (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
};

//Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}_${taskValue}`, completed);
    displayTasks();
};

//Function to add new task
document.querySelector('#push').addEventListener('click', () => {
    disableButtons(false);
    if(newTaskInput.value.length == 0){
        alert('Please, Enter The Task');
    } else {
        if(updateNote == ''){
            updateStorage(count, newTaskInput.value, false);
        } else {
            let existingCount = updateNote.split('_')[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTaskInput.value, false);
            updateNote = '';
        }
        count += 1;
        newTaskInput.value = '';
    }
});