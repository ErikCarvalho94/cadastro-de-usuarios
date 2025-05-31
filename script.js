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

    async function listarUsuarios(){
        try {
            const resposta = await fetch('http://localhost:3000/usuarios'); //url da api
            
            if (!resposta.ok) {
                throw new Error('Erro ao carregar usuários: ' + resposta.status);
}
            const usuarios = await resposta.json();

            //limpa a tabela antes de adicionar
            tabelaUsuarios.innerHTML = '';

            usuarios.forEach(usuario => {
                const linha = document.createElement('tr');
                
                const colunaNome = document.createElement('td');
                colunaNome.textContent = usuario.nome;

                const colunaEmail = document.createElement ('td');
                colunaEmail.textContent = usuario.email;

                linha.appendChild(colunaNome);
                linha.appendChild(colunaEmail);
                
                tabelaUsuarios.appendChild(linha);
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            mensagem.textContent = 'Erro ao carregar a lista de usuários.';
            mensagem.className = 'alert alert-danger';
        }
    }

    listarUsuarios();
});