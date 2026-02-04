# ArmandoFlix - Plataforma de Streaming

## 🚀 Como configurar

Para que o projeto funcione no GitHub Pages ou em qualquer servidor estático, siga estes passos:

### 1. Obter chave da API do TMDB

1. Acesse [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá em **Configurações** > **API**
4. Solicite uma chave de API (é gratuito e instantâneo)
5. Copie sua **API Key (v3 auth)**

### 2. Configurar o projeto

1. Abra o arquivo `config.js`
2. Substitua `'SUA_CHAVE_API_AQUI'` pela sua chave do TMDB
3. Exemplo:
```javascript
const CONFIG = {
    API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Sua chave aqui
    BASE_URL: 'https://api.themoviedb.org/3',
    IMG_URL: 'https://image.tmdb.org/t/p/w500',
    IMG_URL_ORIGINAL: 'https://image.tmdb.org/t/p/original',
    LANGUAGE: 'pt-BR'
};
```

### 3. Fazer upload para o GitHub

```bash
git add .
git commit -m "Configurado com API TMDB"
git push origin main
```

### 4. Ativar GitHub Pages

1. Vá nas configurações do repositório
2. Acesse **Pages**
3. Selecione a branch `main` como fonte
4. Clique em **Save**
5. Aguarde alguns minutos e seu site estará no ar!

## 📁 Estrutura do Projeto

```
projeto-streamer/
├── index.html          # Página principal
├── detalhes.html       # Página de detalhes do filme
├── style.css           # Estilos CSS
├── script.js           # JavaScript principal
├── detalhes.js         # JavaScript da página de detalhes
├── config.js           # ⚠️ Configuração da API (IMPORTANTE)
├── fivecon/            # Favicons
├── logos/              # Logo do site
└── README.md           # Este arquivo
```

## ⚠️ Importante

- **Nunca compartilhe sua chave da API publicamente**
- Para produção, considere usar variáveis de ambiente ou um backend
- O projeto agora funciona 100% no frontend, sem necessidade de servidor Node.js

## 🎬 Funcionalidades

- ✅ Banner rotativo com lançamentos
- ✅ Filmes em destaque
- ✅ Categorias (Comédia, Ação, Drama, Terror)
- ✅ Busca de filmes
- ✅ Página de detalhes com trailer
- ✅ Informações sobre plataformas de streaming

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- API do TMDB
- Font Awesome

## 📝 Licença

Projeto desenvolvido para portfólio por Pedro Armando Gonçalves.
