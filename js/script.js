const form = document.querySelector("form");
const input = document.querySelector(".texto");
const ulTask = document.querySelector(".task-list");

const taskList = [];
function gerarId(taskList) {
  const maiorID = taskList.reduce((acumulador, atual) => {
    if (atual.id > acumulador) {
      acumulador = atual.id;
    }
    return acumulador;
  }, 0);

  return maiorID + 1;
}
function saveTasks(taskList) {
  const stringTask = JSON.stringify(taskList);
  localStorage.setItem("tasks", stringTask);
}

function renderizarTarefas(taskList) {
  ulTask.textContent = "";
  taskList.forEach((task) => {
    const newLi = document.createElement("li");
    const newInput = document.createElement("input");
    const newLabel = document.createElement("label");
    const newButton = document.createElement("button");
    const taskId = `task-${task.id}`;
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", taskId);
    newInput.checked = task.concluida;
    newLabel.setAttribute("for", taskId);
    newLabel.textContent = task.texto;
    newLi.setAttribute("data-id", task.id);
    newButton.textContent = "Excluir";
    newLi.append(newInput, newLabel, newButton);
    if (task.concluida) {
      newLi.classList.add("concluida");
    }

    ulTask.appendChild(newLi);
  });
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    const tasksObj = JSON.parse(storedTasks);

    taskList.push(...tasksObj);
  }
  renderizarTarefas(taskList);
}

loadTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue) {
    const task = {
      id: gerarId(taskList),
      texto: inputValue,
      concluida: false,
    };

    taskList.push(task);
    input.value = "";
    saveTasks(taskList);
    renderizarTarefas(taskList);
  } else {
    console.log("texto inválido, entrando no return");
    return;
  }
});

ulTask.addEventListener("click", (event) => {
  const taskParent = event.target.parentElement;
  const clickDataSet = +taskParent.dataset.id;
  const searchTask = taskList.find((task) => task.id === clickDataSet);

  if (event.target.tagName === "INPUT" || event.target.tagName === "LABEL") {
    searchTask.concluida = !searchTask.concluida;
    saveTasks(taskList);
  }

  if (event.target.tagName === "BUTTON") {
    const indexTask = taskList.findIndex((task) => task.id === clickDataSet);
    taskList.splice(indexTask, 1);
    saveTasks(taskList);
  }
  renderizarTarefas(taskList);
});
