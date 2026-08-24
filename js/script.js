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
    console.log(taskList);
  } else {
    console.log("texto inválido, entrando no return");
    return;
  }
});
