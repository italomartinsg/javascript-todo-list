const form = document.querySelector("form");
const input = document.querySelector(".texto");
const ulTask = document.querySelector(".task-list");
const taskList = [];
const btns = document.querySelector(".btns");
const taskCounter = document.querySelector(".task-counter");
let filterActive = "all";

function getFilteredTasks() {
  if (filterActive === "all") {
    return taskList;
  }
  if (filterActive === "pending") {
    return taskList.filter((task) => task.concluida === false);
  }
  if (filterActive === "completed") {
    return taskList.filter((task) => task.concluida === true);
  }
  return taskList;
}
function syncTaskCounter() {
  const pendingCount = taskList.filter(
    (task) => task.concluida === false,
  ).length;

  if (pendingCount === 1) {
    taskCounter.textContent = `${pendingCount} tarefa pendente!`;
  } else {
    taskCounter.textContent = `${pendingCount} tarefas pendentes!`;
  }
}
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
    const newButtonEdit = document.createElement("button");
    const newButtonDelete = document.createElement("button");
    const taskId = `task-${task.id}`;
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", taskId);
    newInput.checked = task.concluida;
    newLabel.setAttribute("for", taskId);
    newLabel.textContent = task.texto;
    newLi.setAttribute("data-id", task.id);
    newButtonEdit.textContent = "Editar";
    newButtonEdit.setAttribute("data-action", "edit");
    newButtonDelete.textContent = "Excluir";
    newButtonDelete.setAttribute("data-action", "delete");
    newLi.append(newInput, newLabel, newButtonEdit, newButtonDelete);
    if (task.concluida) {
      newLi.classList.add("concluida");
    }

    ulTask.appendChild(newLi);
  });
}
function syncTasks() {
  saveTasks(taskList);
  renderizarTarefas(getFilteredTasks());
  syncTaskCounter();
}

function finalizarEdicao(task, newText) {
  const clearText = newText.trim();
  if (clearText) {
    task.texto = clearText;
    syncTasks();
  } else {
    renderizarTarefas(getFilteredTasks());
  }
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    try {
      const tasksObj = JSON.parse(storedTasks);
      if (Array.isArray(tasksObj)) {
        taskList.push(...tasksObj);
      } else {
        localStorage.removeItem("tasks");
      }
    } catch {
      console.log("Dados das tarefas inválidos.");
      localStorage.removeItem("tasks");
    }
  }
  renderizarTarefas(taskList);
  syncTaskCounter();
}
loadTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (!inputValue) {
    return;
  }
  const task = {
    id: gerarId(taskList),
    texto: inputValue,
    concluida: false,
  };

  taskList.push(task);
  input.value = "";
  syncTasks();
});
btns.addEventListener("click", (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) {
    return;
  }
  filterActive = filter;
  renderizarTarefas(getFilteredTasks());
});
ulTask.addEventListener("click", (event) => {
  const taskParent = event.target.parentElement;
  const clickDataSet = +taskParent.dataset.id;
  const searchTask = taskList.find((task) => task.id === clickDataSet);
  if (!searchTask) {
    return;
  }
  if (event.target.type === "checkbox" || event.target.tagName === "LABEL") {
    searchTask.concluida = !searchTask.concluida;
    syncTasks();
  }

  if (event.target.tagName === "BUTTON") {
    if (event.target.dataset.action === "edit") {
      const labelTask = taskParent.querySelector("label");
      const inputTask = document.createElement("input");
      inputTask.setAttribute("type", "text");
      inputTask.value = searchTask.texto;

      if (labelTask) {
        labelTask.replaceWith(inputTask);
        inputTask.focus();
      }

      event.target.textContent = "Salvar";
      event.target.setAttribute("data-action", "save");
      inputTask.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          finalizarEdicao(searchTask, inputTask.value);
        } else if (event.key === "Escape") {
          renderizarTarefas(getFilteredTasks());
        }
      });
    } else if (event.target.dataset.action === "save") {
      const inputTask = taskParent.querySelector("input[type='text']");
      if (!inputTask) {
        return;
      }
      finalizarEdicao(searchTask, inputTask.value);
    } else if (event.target.dataset.action === "delete") {
      const indexTask = taskList.findIndex((task) => task.id === clickDataSet);
      if (indexTask !== -1) {
        taskList.splice(indexTask, 1);
        syncTasks();
      }
    }
  }
});
