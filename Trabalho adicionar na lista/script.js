const taskList = document.getElementById ("taskList");
const taskInput = document.getElementById ("taskInput");

function addTask(){
    const textItem =  taskInput.value.trim();
    if(textItem !== ''){
        const newTask = document.createElement ("li");
        newTask.innerHTML = `
        <span>${textItem}</span>
        <button onclick="complet(this)"> Concluir </button>
        <button onclick="editar(this)"> Editar </button>
        <button onclick="delet(this)"> Remover </button>
    `;
    taskList.appendChild(newTask);
    taskInput.value = '';
    }
}

function delet(button) {
    const taskToRemove = button.parentElement;
    taskList.removeChild(taskToRemove);

}

function complet(button) {
    const taskMark = button.parentElement
    taskMark.classList.toggle ('completed');
}
