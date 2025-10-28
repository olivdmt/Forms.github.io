/* =================================
 ---------- Variáveis Globais ------
====================================*/

const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const inputEmail = document.querySelector('#email');
const inputNome = document.querySelector('#nome');
const inputSobrenome = document.querySelector('#sobrenome');
const inputIdade = document.querySelector('#idade');
const mensagemErroEmail = document.querySelector('#mensagemErroEmail');
const mensagemErroNome = document.querySelector('#mensagemErroNome');
const mensagemErroSobrenome = document.querySelector('#mensagemErroSobrenome');
const mensagemErroIdade= document.querySelector('#mensagemErroIdade');
const form = document.querySelector('.form');

/* =================================
 ---------- form.html ------
====================================*/

function revisarEnvio(event) {
    event.preventDefault();
    
    const nomeValue = inputNome.value.trim();
    const emailValue = inputEmail.value.trim();
    const sobrenomeValue = inputSobrenome ? inputSobrenome.value.trim() : '';
    const idadeValue = inputIdade ? inputIdade.value.trim() : '';

    let isValido = true;
    // Mensagem de confirmação ao clicar no botão
    if (!confirm ('Tem certeza que deseja continuar? ')) {
        return
    }
    // Validação do Nome, se for menor que 3 e maior que 50 então gera um erro :
    if (nomeValue.length <= 3 || nomeValue.length >= 50) {
        alert('Erro. o nome deve ter entre 3 e 50 caracteres')
        mensagemErroNome.textContent = 'Erro. Por favor revise o campo Nome.';
        mensagemErroNome.style.background = 'rgba(0, 0, 0, 1)'
        inputNome.focus();
        isValido = false;
        return;
    }
    // Validação do Sobrenome: Se for menor que 3 e maior que 50, então não será válido
    if (sobrenomeValue.length <= 3 || sobrenomeValue.length >= 50) {
        alert('Erro. O sobrenome deve ter entre 3 e 50 caracteres.')
        mensagemErroSobrenome.textContent = 'Erro, Por favor revise o campo Sobrenome.';
        mensagemErroSobrenome.style.background = 'rgba(0, 0, 0, 1)'
        inputSobrenome.focus();
        isValido = false;
        return;
    }
    // Validação do Email conforme o regex    
    if (inputEmail.checkValidity()) {
        // O campo passou nas validações nativas do required
            // Validação do Email: Conforme os caracteres do regex usa o método .test() 
        if (!regexEmail.test(emailValue)) {
            alert(`Por favor, insira um endereço de e-mail com formato válido (ex: nome@dominio.com).`)
            mensagemErroEmail.textContent = 'Erro. Por favor revise o campo Email.';
            mensagemErroEmail.style.background = 'rgba(0, 0, 0, 1)'
            inputEmail.focus();
            isValido = false;
            return;
        } else {
            // Se passar na Regex, limpa a validade customizada (essencial para o envio)
            inputEmail.setCustomValidity('');
        }
    } else {
        mensagemErroEmail.textContent = inputEmail.validationMessage;
        inputEmail.focus();
        isValido = false;
        return;
    }

    if (inputIdade && idadeValue) {
        // Converte o valor para inteiro
        const idadeNum = parseInt(idadeValue)
        // Se idadeNum não for um número e for menor que 1, ERROR!
        if (isNaN(idadeNum) || idadeNum < 1 || !Number.isInteger(idadeNum)) {
            alert('Ou você ainda não nasceu ou já morreu. A idadae deve ser número interio e positivo');
            mensagemErroIdade.textContent = 'Erro, Por favor insira um número válido'
            mensagemErroIdade.style.background = 'rgba(0, 0, 0, 1)'
            inputIdade.focus();
            isValido = false;
            return;
        }
    } 
    
   

    if (isValido) {
        // Se for válido, o evento 'submit' continua (e o preventDefault() foi no início)
        // Precisamos forçar o envio, já que o preventDefault() o impediu
        form.submit();
    }

}


// Adicione o event listener ao formulário (IMPORTANTE!)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', revisarEnvio);
    }
});

/* ================================
 ---------- confirmation.html ------
====================================*/

// Função para obter o valor de um parâmetro da URL
function getParametroDaUrl(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

// Função para converter os dados da URL em Objeto e String JSON
function gerarJsonDosDados() {
    const nome = getParametroDaUrl('nome');
    const sobrenome = getParametroDaUrl('sobrenome');
    const email = getParametroDaUrl('email');
    const idade = getParametroDaUrl('idade');

    const dados = {
        nome: nome ? decodeURIComponent(nome) : null,
        sobrenome: sobrenome ? decodeURIComponent(sobrenome) : null,
        email: email ? decodeURIComponent(email) : null,
        idade: idade ? parseInt(idade) : null
    };

    const jsonString = JSON.stringify(dados, null, 2);
    
    return { dados: dados, jsonString: jsonString };
}

// Função para exibir dados da página
function exibirDados() {
    const nome = getParametroDaUrl('nome');
    const sobrenome = getParametroDaUrl('sobrenome');
    const email = getParametroDaUrl('email');
    const idade = getParametroDaUrl('idade');

    if (nome && document.getElementById('display-nome')) {
        document.getElementById('display-nome').textContent = decodeURIComponent(nome);
    }
    if (sobrenome && document.getElementById('display-sobrenome')) {
        document.getElementById('display-sobrenome').textContent = decodeURIComponent(sobrenome);
    }
    if (email && document.getElementById('display-email')) {
        document.getElementById('display-email').textContent = decodeURIComponent(email);
    }
    if (idade && document.getElementById('display-idade')) {
        document.getElementById('display-idade').textContent = decodeURIComponent(idade);
    } 
}

// Função para baixar o arquivo JSON
function baixarArquivoJson(jsonString, nomeArquivo) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function finalizarEnvio() {
    alert("Dados confirmados! Envio FINALIZADO para o servidor.");
    const resultado = gerarJsonDosDados();
    
    const nomeArquivo = `data.json`;
    baixarArquivoJson(resultado.jsonString, nomeArquivo);
    window.location.href = '../index.html';
}

// Executa exibirDados apenas na página de confirmação
if (window.location.pathname.includes('confirmation.html')) {
    exibirDados();
}