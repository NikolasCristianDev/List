// Seletores principais da interface
const inputNameTarefa = document.querySelector("#inputNameTarefa");
const listaTarefas = document.querySelector("#listaTarefas");
const btnTarefa = document.querySelector("#btnTarefa");

// Seletores do Modal de Edição
const janelaEdit = document.querySelector("#janelaEdit");
const janelaEditFundo = document.querySelector("#janelaEditFundo");
const janelaEditFechar = document.querySelector('#janelaEditFechar');
const btnUPtarefa = document.querySelector('#btnUPtarefa');
const idtarefaEdit = document.querySelector('#tarefaEdit');
const inputTarefaNomeEdit = document.querySelector('#inputTarefaNomeEdit');

// --- LÓGICA DE ARMAZENAMENTO (LocalStorage) ---

// Array que servirá como nosso banco de dados local
let bancoDeDados = [];

// Salva o array de tarefas no LocalStorage convertido em String
function salvarNoLocalStorage() {
    localStorage.setItem('listaTarefas_APP', JSON.stringify(bancoDeDados));
}

// Busca os dados, converte de volta para Objeto e desenha na tela
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('listaTarefas_APP');
    if (dadosSalvos) {
        bancoDeDados = JSON.parse(dadosSalvos);
        renderizarTarefas();
    }
}

// Limpa a lista visual e reconstrói tudo baseado no bancoDeDados
function renderizarTarefas() {
    listaTarefas.innerHTML = ""; 
    bancoDeDados.forEach(tarefa => {
        const li = criarTagLI(tarefa);
        listaTarefas.appendChild(li);
    });
}

// --- EVENTOS ---

inputNameTarefa.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) prepararNovaTarefa();
});

btnTarefa.addEventListener("click", () => prepararNovaTarefa());

janelaEditFechar.addEventListener('click', () => alterarJanelaEdit());

btnUPtarefa.addEventListener('click', (e) => {
    e.preventDefault();
    let idTarefa = idtarefaEdit.innerHTML.replace('#', '');
    
    // Atualiza o nome dentro do Array bancoDeDados
    const tarefaIndex = bancoDeDados.findIndex(t => t.id == idTarefa);
    if (tarefaIndex !== -1) {
        bancoDeDados[tarefaIndex].nome = inputTarefaNomeEdit.value;
        salvarNoLocalStorage(); // Salva a mudança
        renderizarTarefas();    // Atualiza a tela
        alterarJanelaEdit();
    }
});

// --- FUNÇÕES DE APOIO ---

function prepararNovaTarefa() {
    let nome = inputNameTarefa.value.trim();
    if (nome !== "") {
        let tarefa = {
            nome: nome,
            id: gerarID(),
        };
        addTarefa(tarefa);
    } else {
        alert("Digite o nome da tarefa!");
    }
}

function gerarID() {
    return Math.floor(Math.random() * 999999); // ID maior para evitar conflitos
}

function addTarefa(tarefa) {
    bancoDeDados.push(tarefa); // Adiciona ao banco
    salvarNoLocalStorage();    // Salva no navegador
    renderizarTarefas();       // Desenha na tela
    inputNameTarefa.value = "";
    inputNameTarefa.focus();
}

function criarTagLI(tarefa) {
    let li = document.createElement('li');
    li.id = tarefa.id;

    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = tarefa.nome;

    let div = document.createElement('div');

    let btnEdit = document.createElement('button');
    btnEdit.classList.add("btnAcao");
    btnEdit.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEdit.onclick = () => editar(tarefa.id);

    let btnRemove = document.createElement('button');
    btnRemove.classList.add("btnAcao");
    btnRemove.innerHTML = '<i class="fa fa-trash"></i>';
    btnRemove.onclick = () => excluir(tarefa.id);

    div.appendChild(btnEdit);
    div.appendChild(btnRemove);
    li.appendChild(span);
    li.appendChild(div);

    return li;
}

function editar(idTarefa) {
    const tarefa = bancoDeDados.find(t => t.id == idTarefa);
    if (tarefa) {
        idtarefaEdit.innerHTML = '#' + idTarefa;
        inputTarefaNomeEdit.value = tarefa.nome;
        alterarJanelaEdit();
    }
}

function excluir(idTarefa) {
    if (confirm('Tem certeza que deseja excluir?')) {
        // Filtra o banco para remover a tarefa com o ID clicado
        bancoDeDados = bancoDeDados.filter(t => t.id != idTarefa);
        salvarNoLocalStorage(); // Salva a nova lista sem o item excluído
        renderizarTarefas();    // Redesenha a tela
    }
}

function alterarJanelaEdit() {
    janelaEdit.classList.toggle('abrir');
    janelaEditFundo.classList.toggle('abrir');
}

// INICIALIZAÇÃO: Carrega os dados assim que a página abre
carregarDoLocalStorage();