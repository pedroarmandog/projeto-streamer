require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)))

const API_KEY = process.env.TMDB_KEY

// Rota para filmes populares
app.get('/api/filmes', async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filmes' })
  }
})

// Rota para detalhes de um filme
app.get('/api/filme/:id', async (req, res) => {
  try {
    const id = req.params.id
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do filme' })
  }
})

// Rota para buscar filmes
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filmes' })
  }
})

// Rota para plataformas de streaming
app.get('/api/filme/:id/plataformas', async (req, res) => {
  try {
    const id = req.params.id
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar plataformas' })
  }
})

// Rota para trailers/vídeos
app.get('/api/filme/:id/videos', async (req, res) => {
  try {
    const id = req.params.id
    const language = req.query.language || 'pt-BR'
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=${language}`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vídeos' })
  }
})

// Rota para novos lançamentos (banner)
app.get('/api/lancamentos', async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar lançamentos' })
  }
})

// Rota para filmes por gênero (categorias)
app.get('/api/categoria/:generoId', async (req, res) => {
  try {
    const generoId = req.params.generoId
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${generoId}&page=1`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categoria' })
  }
})

// Rota para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
  console.log('Acesse: http://localhost:3000')
})
