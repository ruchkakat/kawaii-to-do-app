//Initial References
const newTaskInput = document.querySelector('#new-task input');
const tasksDiv = document.querySelector('#tasks');
let deleteTasks, editTasks, tasks;
let updateNote = '';
let count;

//Function on window load 
window.onload = () => {
    updateNote = '';
    count = Object.keys(localStorage.length);
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
        let classValue = '';

        //Get all values
        let value = localStorage.getItem(key);
        let taskInnerDiv = document.createElement('div');
        taskInnerDiv.classList.add('task');
        taskInnerDiv.setAttribute('id', key);
        taskInnerDiv.innerHTML = `<span id='taskname'>${key.split('_')[1]}</span>`
        //local storage would store boolean as string so we parse it to boolean back
        let editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        if(!JSON.parse(value)){
            editButton.style.visibility = 'visible';
        } else {
            editButton.style.visibility = 'hidden';
            taskInnerDiv.classList.add('completed');
        }
        taskInnerDiv.appendChild(editButton);
        taskInnerDiv.innerHTML += `<button class='delete'><i class="fa-solid fa-trash"></i></button>`;
        tasksDiv.appendChild(taskInnerDiv);
    }

    //Tasks completed
    tasks = document.querySelectorAll('.task');
    tasks.forEach((element) => {
        element.addEventListener('click', function handler() {
            if(element.classList.contains('completed')){
                updateStorage(element.id.split('_')[0], element.innerText, false);
            } else {
                updateStorage(element.id.split('_')[0], element.innerText, true);
            }
            element.removeEventListener('click', handler);
        });
    });

    //Edit tasks
    editTasks = document.getElementsByClassName('edit');
    Array.from(editTasks).forEach((element, index) => {
        element.addEventListener('click', (e) => {
            //Stop propagation to outer elements (if removed when we click delete eventually the click will move to parent)
            e.stopPropagation();
            //Disable other edit buttons when one task is being edited
            disableButtons(true);
            //Update input value and remove div
            let parent = element.parentElement;
            newTaskInput.value = parent.querySelector('#taskname').innerText;
            //Set updateNote to the task that is being edited
            updateNote = parent.id;
            //Remove task
            parent.remove();
        });
    });

    //Delete tasks
    deleteTasks = document.getElementsByClassName('delete');
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            //Delete from local storage and remove div
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
    //Enable the edit button
    disableButtons(false);
    if(newTaskInput.value.length == 0){
        alert('Please, Enter The Task');
    } else {
        //Store locally and display from local storage
        if(updateNote == ''){
            //New task
            updateStorage(count, newTaskInput.value, false);
        } else {
            //Update task
            let existingCount = updateNote.split('_')[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTaskInput.value, false);
            updateNote = '';
        }
        count += 1;
        newTaskInput.value = '';
    }
});