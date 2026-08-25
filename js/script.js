const form = document.querySelector("form");
const input = document.querySelector(".texto");
const ulTask = document.querySelector(".task-list");

//modelo de objetos para teste
//  { id: 1, texto: "Estudar JavaScript", concluida: false },  { id: 2, texto: "Estudar DOM", concluida: false },  { id: 3, texto: "Praticar Arrays", concluida: false }

const taskList = [
  { id: 1, texto: "Estudar JavaScript", concluida: false },
  { id: 2, texto: "Estudar DOM", concluida: false },
  { id: 3, texto: "Praticar Arrays", concluida: false },
];
function gerarId(taskList) {
  const maiorID = taskList.reduce((acumulador, atual) => {
    if (atual.id > acumulador) {
      acumulador = atual.id;
    }
    return acumulador;
  }, 0);

  return maiorID + 1;
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

renderizarTarefas(taskList);

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
  }

  if (event.target.tagName === "BUTTON") {
    const indexTask = taskList.findIndex((task) => task.id === clickDataSet);
    taskList.splice(indexTask, 1);
  }
  renderizarTarefas(taskList);
});
