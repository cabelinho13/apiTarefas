const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

// Criar nova tarefa
router.post('/post', async (req, res) => {
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
router.get('/getAll', async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deletar uma tarefa por ID
router.delete('/delete/:id', async (req, res) => {
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
router.patch('/update/:id', async (req, res) => {
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
