# Gerenciador de Usuários (CRUD) com Node.js, Express e Frontend Estático

Projeto completo de gerenciamento de usuários, com funcionalidades de cadastro, listagem, edição e exclusão.
O backend foi desenvolvido em Node.js com Express, conectado a um banco de dados PostgreSQL, que inclui as tabelas usuários e auditoria — esta última responsável por registrar todas as alterações realizadas no sistema.
O frontend é estático, construído com HTML, CSS e JavaScript puro, e conta com recursos como: Alternância entre modo claro e escuro, Funcionalidades de acessibilidade, Paginação de resultados, Documentação detalhada do projeto

## Funcionalidades

- **CRUD de usuários**: Adicione, edite, liste e exclua usuários (nome e e-mail).
- **Frontend moderno**: Interface responsiva com Bootstrap 5, ícones e layout intuitivo.
- **Alternância de tema**: Botão para alternar entre tema claro e escuro, com preferência salva no navegador.
- **Acessibilidade**: Ciclo de foco com Tab entre o botão de tema e a paginação, contraste adequado e navegação por teclado.
- **Paginação**: Exibe 5 usuários por página, com navegação fácil.
- **Mensagens de feedback**: Alertas amigáveis para sucesso e erro.

## Como Executar Localmente

1. **Clone o repositório**

```sh
git clone <url-do-repo>
cd crud-node
```

2. **Instale as dependências**

```sh
npm install
```

3. **Configure o banco de dados PostgreSQL**

- Crie um banco e as tabelas `usuarios` e `auditoria`:

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL
);

CREATE TABLE auditoria (
  id SERIAL PRIMARY KEY,
  acao VARCHAR(50),
  dados TEXT,
  data_hora TIMESTAMP
);
```

- Crie um arquivo `.env` na raiz com:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/nomedobanco
```

4. **Inicie o backend**

```sh
node index.js
```

O backend estará em http://localhost:3000

5. **Acesse o frontend**

- Abra `docs/index.html` no navegador **OU**
- Acesse http://localhost:3000 (Express serve a pasta `docs` como estática)

> **Atenção:** Para funcionamento completo (CRUD), o backend Node.js deve estar rodando.

## Deploy

- O projeto pode ser hospedado em qualquer serviço que suporte Node.js e PostgreSQL (ex: Render, Heroku, Railway).
- O frontend pode ser hospedado separadamente, mas para funcionamento total, precisa do backend ativo.

## Tecnologias Utilizadas

- Node.js, Express
- PostgreSQL
- Bootstrap 5, Bootstrap Icons
- HTML5, CSS3, JavaScript
- dayjs (para datas)

## Acessibilidade

- Navegação por teclado (Tab/Shift+Tab entre botões principais)
- Contraste adequado nos dois temas
- Elementos com foco visível

## Licença

Este projeto é livre para uso educacional e pessoal.

---

Desenvolvido por Erik Carvalho.