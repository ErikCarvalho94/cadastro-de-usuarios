document.addEventListener('DOMContentLoaded', () => {
    let idUsuarioParaEditar = null;
    
    const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicao'));
    const formEdicao = document.getElementById('formEdicao');
    const editarNomeInput = document.getElementById('editarNome');
    const editarEmailInput = document.getElementById('editarEmail');

    function editarUsuario(usuario) {
        idUsuarioParaEditar = usuario.id;
        editarNomeInput.value = usuario.nome;
        editarEmailInput.value = usuario.email;
        modalEdicao.show();
    }

    formEdicao.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nomeEditado = editarNomeInput.value.trim();
        const emailEditado = editarEmailInput.value.trim();

        if (!nomeEditado || !emailEditado) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (!emailValido(emailEditado)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        try {
            const resposta = await fetch (`https://cadastro-de-usuarios-0ete.onrender.com/usuarios/${idUsuarioParaEditar}`, {
       
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nome: nomeEditado, email: emailEditado })
    });
            if (resposta.ok) {
                // Atualiza o usuário no array mantendo a posição
            const index = usuarios.findIndex(u => u.id === idUsuarioParaEditar);
            if (index !== -1) {
                usuarios[index].nome = nomeEditado;
                usuarios[index].email = emailEditado;
            }
            renderizarTabela();
            modalEdicao.hide();
            exibirMensagem('Usuário atualizado com sucesso!');
            } else {
                exibirMensagem('Erro ao atualizar usuário.', 'danger');            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar usuário.');
        }
    });
    
    let idUsuarioParaExcluir = null;
    
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const botaoConfirmarExclusao = document.getElementById('confirmarExclusao');

    botaoConfirmarExclusao.addEventListener('click', () => {
        if (idUsuarioParaExcluir) {
            excluirUsuario(idUsuarioParaExcluir);
            modalConfirmacao.hide();
        }
    })
    
    const formulario = document.getElementById('formUsuario');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagem = document.getElementById('mensagem');
    const tabelaUsuarios = document.querySelector('#tabelaUsuarios tbody');
    const botaoAdicionar = formulario.querySelector('button[type="submit"]');
    botaoAdicionar.disabled = true;

    function verificarCampos() {
        botaoAdicionar.disabled = !(nomeInput.value.trim() && emailInput.value.trim());
    }
    nomeInput.addEventListener('input', verificarCampos);
    emailInput.addEventListener('input', verificarCampos);

    function emailValido(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function exibirMensagem(texto, tipo = 'success') {
        const mensagem = document.getElementById('mensagem');

        mensagem.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
            </div>
        `;

        setTimeout(() => {
            const alerta = mensagem.querySelector('.alert');
            if (alerta) {
                alerta.classList.remove('show');
                alerta.classList.add('hide');
                setTimeout(() => mensagem.innerHTML = '', 300);
            }
        }, 3000);
    }

    function adicionarUsuarioNaTabela(usuario) {
        const linha = document.createElement('tr');
        
        linha.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>
            <button class="btn btn-outline-warning btn=sm botao-editar me-1" title="Editar">
            <i class="bi bi-pencil fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm botao-excluir" title="Excluir">
             <i class="bi bi-trash fs-5"></i>
            </button>
        </td>
        `;

        const botaoExcluir = linha.querySelector('.botao-excluir');
        
        const botaoEditar = linha.querySelector('.botao-editar');

        botaoExcluir.addEventListener('click', () => {
            // Armazenar o ID do usuário a ser excluído
            idUsuarioParaExcluir = usuario.id;
            // Abrir o modal
            modalConfirmacao.show();
        })
        botaoEditar.addEventListener('click', () => {
            editarUsuario(usuario)
        })

        tabelaUsuarios.appendChild(linha);
    }

    async function excluirUsuario(id) {
        try {
            const resposta = await fetch(`https://cadastro-de-usuarios-0ete.onrender.com/usuarios/${id}`, {
                method: 'DELETE'
        });

        if (resposta.ok) {
            exibirMensagem('Usuário excluído com sucesso!', 'warning');
            listarUsuarios();
        } else {
            exibirMensagem('Erro ao excluir usuário.', 'danger');
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
            const resposta = await fetch('https://cadastro-de-usuarios-0ete.onrender.com/usuarios',  {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nome, email })
            });

            if (resposta.ok) {
                const usuarioCriado = await resposta.json();
                //adicionarUsuarioNaTabela(usuarioCriado);
                exibirMensagem('Usuário adicionado com sucesso!', 'success');
                formulario.reset();
                verificarCampos();
                listarUsuarios();
            } else {
                const erro = await resposta.json();
                exibirMensagem(`Erro: ${erro.error}`, 'danger');
            }
        } catch (erro) {
            console.error('Erro ao adicionar usuário:', erro);
            exibirMensagem('Erro ao adicionar usuário', 'danger');
        }
    });


    let usuarios = [];
    let paginaAtual = 1;
    const itensPorPagina = 5;

    function renderizarTabela() {
        tabelaUsuarios.innerHTML = '';

        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const usuariosPagina = usuarios.slice(inicio, fim);

        usuariosPagina.forEach(usuario => {
            adicionarUsuarioNaTabela(usuario);
        });

        renderizarPaginacao();
    }

    function renderizarPaginacao() {
        const totalPaginas = Math.ceil(usuarios.length / itensPorPagina);
        const paginacao = document.getElementById('pagination');

        paginacao.innerHTML = `
         <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" id="anterior">&lt;</a>
         </li>
         <li class="page-item disabled">
            <span class="page-link">${paginaAtual} / ${totalPaginas}</span>
         </li>
         <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" id="proximo">&gt;</a>
         </li>
         `;

         document.getElementById('anterior').addEventListener('click', (e) => {
            e.preventDefault();
            if (paginaAtual > 1) {
                paginaAtual--;
                renderizarTabela();
            }
         });

         document.getElementById('proximo').addEventListener('click', (e) => {
            e.preventDefault();
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                renderizarTabela();
            }
         });
    }

    async function listarUsuarios() {
        try {
            const resposta = await fetch('https://cadastro-de-usuarios-0ete.onrender.com/usuarios');
            if (!resposta.ok) {
                throw new Error('Erro ao carregar usuários: ' +resposta.status);
            }
            usuarios = await resposta.json();

            paginaAtual = 1
            renderizarTabela();
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            exibirMensagem('Erro ao listar usuários', 'danger');
        }
    }

    // Alternância de tema claro/escuro
    const botaoTema = document.getElementById('botao-tema');
    const iconeTema = document.getElementById('icone-tema');

    function definirTema(escuro) {
        if (escuro) {
            document.body.classList.add('tema-escuro');
            iconeTema.classList.remove('bi-moon');
            iconeTema.classList.add('bi-sun');
        } else {
            document.body.classList.remove('tema-escuro');
            iconeTema.classList.remove('bi-sun');
            iconeTema.classList.add('bi-moon');
        }
    }

    // Carrega preferência do tema
    const temaPref = localStorage.getItem('tema');
    definirTema(temaPref === 'escuro');

    botaoTema.addEventListener('click', () => {
        const escuro = !document.body.classList.contains('tema-escuro');
        definirTema(escuro);
        localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    });

    // Acessibilidade: ciclo de foco com Tab
    function getElementosFocaveis() {
        return Array.from(document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    }

    document.addEventListener('keydown', function(evento) {
        if (evento.key === 'Tab') {
            const botaoTema = document.getElementById('botao-tema');
            const botaoProximo = document.getElementById('proximo');
            if (!botaoTema || !botaoProximo) return;
            // Se Tab no botão '>'
            if (!evento.shiftKey && document.activeElement === botaoProximo) {
                evento.preventDefault();
                botaoTema.focus();
            }
            // Se Shift+Tab no botão de tema
            else if (evento.shiftKey && document.activeElement === botaoTema) {
                evento.preventDefault();
                botaoProximo.focus();
            }
        }
    });

    listarUsuarios();
});