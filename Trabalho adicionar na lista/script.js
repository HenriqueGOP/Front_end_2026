const lista = document.getElementById ("taskList");
const input = document.getElementById ("taskInput");

function addTask(){
    const textItem =  taskInput.value.trim();
    if(textItem !== ''){
        const newTask = document.createElement ("li");
        newTask.innerHTML = `
        <span>${textItem}</span>
        <button onclick=""> Concluir </button>
        <button onclick=""> Editar </button>
        <button onclick=""> Remover </button>
    `;
    taskList.appendChild(newTask);
    taskInput.value = '';
    }
}