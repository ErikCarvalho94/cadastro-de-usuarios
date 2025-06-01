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
        <td>
            <button class="btn btn-warning btn=sm botao-editar me-2" title="Editar">
            <i class="bi bi-pencil fs-6"></i>
            </button>
            <button class="btn btn-danger btn-sm botao-excluir" title="Excluir">
             <i class="bi bi-trash fs-6"></i>
            </button>
        </td>
        `;

        const botaoExcluir = linha.querySelector('.botao-excluir');
        const botaoEditar = linha.querySelector('.botao-editar');

        botaoExcluir.addEventListener('click', () => {
            excluirUsuario(usuario.id)
        })
        botaoEditar.addEventListener('click', () => {
            editarUsuarios(usuario)
        })

        tabelaUsuarios.appendChild(linha);
    }

    async function excluirUsuario(id) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        try {
            const resposta = await fetch(`/usuarios/${id}`, {
                method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Usuário excluído com sucesso!');
            listarUsuarios();
        } else {
            alert('Erro ao excluir usuário.');
        }
    } catch (error) {
            console.error('Erro ao excluir usuário:', error);
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
                adicionarUsuarioNaTabela(usuario);
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            mensagem.textContent = 'Erro ao carregar a lista de usuários.';
            mensagem.className = 'alert alert-danger';
        }
    }

    listarUsuarios();
});