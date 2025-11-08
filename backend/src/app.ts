import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors'
import listaRoutes from './routes/ListaRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lista-compras-db';

// Middlewares
app.use(cors()); // Habilita o CORS para que o front-end possa se conectar
app.use(json()); // Para fazer o parse do body das requisições

// Rotas
app.use('/api', listaRoutes);

// Conexão com o MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB!');
        // Inicia o servidor após a conexão com o banco
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro de conexão com o MongoDB:', err);
        process.exit(1);
    });