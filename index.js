const express = require('express'); // Importa o módulo Express.js para criar um servidor web.
const app = express(); // Cria uma instância do aplicativo Express.

// Middleware para configurar os cabeçalhos CORS (Cross-Origin Resource Sharing).
//Um middleware é uma função intermediária que processa requisições antes que elas cheguem ao manipulador final (rota) 
// ou antes que a resposta seja enviada ao cliente.
// Isso permite que o servidor aceite solicitações de diferentes origens (domínios).
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Permite solicitações de qualquer origem.
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE'); // Define os métodos HTTP permitidos.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept" // Define os cabeçalhos permitidos.
    );
    next(); // Passa o controle para o próximo middleware.
});

app.use(express.json()); // Middleware para analisar o corpo das solicitações como JSON.

const PORT = process.env.PORT || 3000; // Define a porta do servidor, usando a variável de ambiente PORT ou 3000 como padrão.

// Inicia o servidor e exibe uma mensagem no console.
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});

// Depois - Importa o conjunto de rotas definidas no arquivo 'routes.js'
const routes = require('./routes/routes');

// Depois - Define que todas as rotas dentro de 'routes.js' estarão acessíveis sob o prefixo '/api'
app.use('/api', routes);


// Configura a conexão com o banco de dados MongoDB usando Mongoose.
var mongoose = require('mongoose'); // Importa o módulo Mongoose.
mongoose.connect("mongodb+srv://backend:9aCf5f7sRWChndQJ@cluster0.hmpik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // Conecta ao banco de dados usando a URL fornecida.
mongoose.Promise = global.Promise; // Configura o Mongoose para usar as Promises globais.

const db = mongoose.connection; // Obtém a conexão com o banco de dados.

// Define um manipulador de eventos para erros de conexão com o banco de dados.
db.on('error', (error) => {
    console.log(error); // Exibe o erro no console.
});

// Define um manipulador de eventos para quando a conexão com o banco de dados for estabelecida com sucesso.
db.once('connected', () => {
    console.log('Database Connected'); // Exibe uma mensagem de sucesso no console.
});