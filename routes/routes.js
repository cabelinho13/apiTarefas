const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');
const jwt = require('jsonwebtoken');

// Autenticação: login que gera token
router.post('/login', (req, res) => {
    if (req.body.nome === 'branqs' && req.body.senha === '1234') {
        const token = jwt.sign({ id: req.body.nome }, 'segredo', { expiresIn: 300 }); // 5min
        return res.json({ auth: true, token: token });
    }
    res.status(401).json({ auth: false, message: 'Login inválido!' });
});

// Middleware de autorização
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token não fornecido' });

    jwt.verify(token, 'segredo', (err, decoded) => {
        if (err) return res.status(500).json({ auth: false, message: 'Token inválido!' });
        next();
    });
}

// Criar nova tarefa
router.post('/post', verificaJWT, async (req, res) => {
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,
        statusRealizada: req.body.statusRealizada
    });

    try {
        const tarefaSalva = await objetoTarefa.save();
        res.status(200).json(tarefaSalva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Listar todas as tarefas
router.get('/getAll', verificaJWT, async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deletar uma tarefa por ID
router.delete('/delete/:id', verificaJWT, async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
        if (!resultado) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }
        res.json({ message: "Tarefa deletada com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Atualizar uma tarefa por ID
router.patch('/update/:id', verificaJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const novaTarefa = req.body;
        const options = { new: true };
        const result = await modeloTarefa.findByIdAndUpdate(id, novaTarefa, options);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
