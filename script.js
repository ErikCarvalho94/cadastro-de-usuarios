document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.getElementById('formUsuario');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagem = document.getElementById('mensagem');
    const tabelaUsuarios = document.querySelector('#tabelaUsuarios tbody');

    function emailValido(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function exibirMensagem(texto, tipo = 'success') {
        mensagem.textContent = texto;
        mensagem.className = `alert alert-${tipo} mt-3`;
    }

    function adicionarUsuarioNaTabela(usuario) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        `;
        tabelaUsuarios.appendChild(linha);
    }

    async function carregarUsuarios() {
        try {
            const resposta = await fetch('/usuarios');
            const usuarios = await resposta.json();

            tabelaUsuarios.innerHTML = '';

            usuarios.forEach(usuario => {
                adicionarUsuarioNaTabela(usuario);
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();

        if (!nome || !email) {
            exibirMensagem('Por favor, preencha todos os campos.', 'danger');
            return;
        }

        if (!emailValido(email)) {
            exibirMensagem('Por favor, insira um e-mail válido.', 'danger');
            return;
        }

        try {
            const resposta = await fetch('/usuarios', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nome, email })
            });

            if (resposta.ok) {
                const usuarioCriado = await resposta.json();
                adicionarUsuarioNaTabela(usuarioCriado);
                exibirMensagem('Usuário adicionado com sucesso!', 'success');
                formulario.reset();
            } else {
                const erro = await resposta.json();
                exibirMensagem(`Erro: ${erro.error}`, 'danger');
            }
        } catch (erro) {
            console.error('Erro ao adicionar usuário:', erro);
            exibirMensagem('Erro ao adicionar usuário', 'danger');
        }
    });

    carregarUsuarios();
});