import express from "express";
import dotenv from "dotenv";
import nodemon from "nodemon";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, "biblioteca.json");

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
  
});

app.get("/filmes", (req, res) => {
  const filmes = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  if (!filmes || filmes.length === 0) {
    return res.status(404).json({ error: "Nenhum filme encontrado" });
  }

  res.json(filmes);
});

app.get("/filmes/favoritos", (req, res) => {
  if (!fs.existsSync(jsonFilePath)) {
    return res.status(404).json({ error: "Arquivo de filmes não encontrado" });
  }  
  const filmes = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  const filmesFavoritos = filmes.filter(filme => filme.favorito);
  res.json(filmesFavoritos);
});

app.get("/filmes/pesquisar", (req, res) => {
  const titulo = req.query.titulo;
  const filmesEncontrados = filmes.filter(filme => filme.titulo.toLowerCase().includes(titulo.toLowerCase()));

  if (filmesEncontrados.length === 0) {
    return res.status(404).json({ error: "Nenhum filme encontrado com esse título" });
  }

  console.log(`Filmes encontrados: ${filmesEncontrados}`);

  res.json(filmesEncontrados);
});

app.get("/filmes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(f => f.id === id);
    
    if (!filme) {
        return res.status(404).json({ error: "Filme não encontrado" });
    }
    
    res.json(filme);
});


app.patch("/filmes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(f => f.id === id);

    if (!filme) {
        return res.status(404).json({ error: "Filme não encontrado" });
    }

    filme.favorito = !filme.favorito;

    const mensagem = filme.favorito ? "Filme adicionado aos favoritos" : "Filme removido dos favoritos";
    res.json({ message: mensagem, filme });
});

app.delete("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = filmes.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Filme não encontrado" });
  }

  filmes.splice(index, 1);

  res.json({ message: "Filme removido com sucesso" });
});

app.post("/filmes", (req, res) => {
  const { titulo, genero, favorito } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ error: "Título e gênero são obrigatórios" });
  }

  const novoFilme = {
    id: filmes.length + 1,
    titulo,
    genero,
    favorito: favorito || false
  }
  filmes.push(novoFilme);

  res.status(201).json(novoFilme);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});