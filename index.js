require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao conectar com o banco' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuarios' });
  }
});

app.post('/usuarios', async (req, res) => {
  const { nome, email} = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );

    const usuarioInserido = result.rows[0]

    await pool.query(
      'INSERT INTO auditoria (acao, dados) VALUES ($1, $2)',
      ['inserção',JSON.stringify(usuarioInserido)]
    );

    res.status(201).json(usuarioInserido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar usuário' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;         // Pega o ID da URL
  const { nome, email } = req.body; // Pega nome e email do corpo da requisição
  
  try{
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *', 
      [nome, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const usuarioAtualizado = result.rows[0];

    await pool.query(
      'INSERT INTO auditoria (acao, dados) VALUES ($1, $2)',
      ['atualização', JSON.stringify(usuarioAtualizado)]
    );

    res.json({ message: 'Usuário atualizado!'})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL

  try {
    const usuarioResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const usuarioDeletado = usuarioResult.rows[0];

    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    if (result.rowCount > 0) {
      await pool.query(
        'INSERT INTO auditoria (acao, dados) VALUES ($1, $2)',
        ['DELETE', JSON.stringify(usuarioDeletado)]
      );
      res.json({ message: 'usuário deletado com sucesso!' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário'})
  }
})



app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});