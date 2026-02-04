


// Onde os filmes vão aparecer
const divFilmes = document.getElementById('filmes')

// Buscar os filmes na API do TMDB diretamente
const URL = `${CONFIG.BASE_URL}/movie/popular?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}`

fetch(URL)
    .then(response => response.json())
    .then(dados => {
        console.log(dados) // Só para testar
        dados.results.forEach(filme => {
            divFilmes.innerHTML += `
            <div class="card" onclick="abrirDetalhes(${filme.id})">
            <img src = "${CONFIG.IMG_URL}${filme.poster_path}">
            <h3>${filme.title}</h3>
            <p>⭐ Nota: ${filme.vote_average} </p>
            </div>`
        });
    })

.catch(erro => {
    console.error('Erro ao buscar os filmes:', erro);
})

// =====================
// SISTEMA DE PESQUISA
// =====================

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let searchTimeout;

searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    // Limpa o timeout anterior
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        searchResults.classList.remove('show');
        return;
    }
    
    // Aguarda 500ms após o usuário parar de digitar
    searchTimeout = setTimeout(() => {
        searchMovies(query);
    }, 500);
});

async function searchMovies(query) {
    try {
        const response = await fetch(
            `${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        
        console.log('Resultados da busca:', data); // Debug
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
    }
}

function displaySearchResults(movies) {
    if (!movies || movies.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Nenhum filme encontrado</div>';
        searchResults.classList.add('show');
        return;
    }
    
    searchResults.innerHTML = movies.slice(0, 5).map(movie => `
        <div class="search-result-item" onclick="goToDetails(${movie.id})">
            <img src="${movie.poster_path ? CONFIG.IMG_URL + movie.poster_path : 'https://via.placeholder.com/50x75?text=Sem+Imagem'}" 
                 alt="${movie.title}">
            <div class="search-result-info">
                <h4>${movie.title}</h4>
                <p>${movie.release_date ? movie.release_date.substring(0, 4) : 'Data desconhecida'} • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
            </div>
        </div>
    `).join('');
    
    searchResults.classList.add('show');
}

function goToDetails(movieId) {
    window.location.href = `detalhes.html?id=${movieId}`;
}

// Fecha os resultados ao clicar fora
document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-container')) {
        searchResults.classList.remove('show');
    }
});

function abrirDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`
}

// ===============================
// BANNER - NOVOS LANÇAMENTOS
// ===============================

const URL_LANCAMENTOS = `${CONFIG.BASE_URL}/movie/now_playing?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}&page=1`

let filmesBanner = []
let indiceBanner = 0

// Buscar lançamentos
fetch(URL_LANCAMENTOS)
    .then(res => res.json())
    .then(dados => {

        filmesBanner = dados.results

        if (filmesBanner.length > 0) {
            mostrarBanner()
            setInterval(trocarBanner, 6000) // troca a cada 6s
        }

    })
    .catch(erro => {
        console.error('Erro ao buscar lançamentos:', erro);
    })


// Mostrar no banner
function mostrarBanner() {

    const filme = filmesBanner[indiceBanner]

    const banner = document.querySelector(".banner")

    banner.style.backgroundImage =
        `url(${CONFIG.IMG_URL_ORIGINAL}${filme.backdrop_path})`

    document.getElementById("banner-title").innerText = filme.title

    document.getElementById("banner-description").innerText =
        filme.overview || "Sem descrição disponível."

    // Botão info
    document.getElementById("banner-info").onclick = () => {
        window.location.href = `detalhes.html?id=${filme.id}`
    }

    // Botão assistir (vai pra detalhes)
    document.getElementById("banner-play").onclick = () => {
        window.location.href = `detalhes.html?id=${filme.id}`
    }
}


// Trocar banner
function trocarBanner() {

    indiceBanner++

    if (indiceBanner >= filmesBanner.length) {
        indiceBanner = 0
    }

    mostrarBanner()
}

// ===============================
// CATEGORIAS POR GÊNERO
// ===============================

// Função para buscar filmes por gênero
function carregarCategoria(generoId, divId) {

    const url = `${CONFIG.BASE_URL}/discover/movie?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}&with_genres=${generoId}&page=1`

    fetch(url)
        .then(res => res.json())
        .then(dados => {

            const div = document.getElementById(divId)

            dados.results.forEach(filme => {

                div.innerHTML += `
                    <div class="card" onclick="abrirDetalhes(${filme.id})">
                        <img src="${CONFIG.IMG_URL}${filme.poster_path}">
                        <h3>${filme.title}</h3>
                        <p>⭐ ${filme.vote_average}</p>
                    </div>
                `
            })

        })
        .catch(erro => {
            console.error(`Erro ao carregar categoria ${generoId}:`, erro);
        })
}

// Funções de scroll para as setas
function scrollLeft(sectionId) {
    const container = document.getElementById(sectionId);
    container.scrollBy({
        left: -600,
        behavior: 'smooth'
    });
}

function scrollRight(sectionId) {
    const container = document.getElementById(sectionId);
    container.scrollBy({
        left: 600,
        behavior: 'smooth'
    });
}

// Carregar categorias
carregarCategoria(35, "filmes-comedia") // Comédia
carregarCategoria(28, "filmes-acao")    // Ação
carregarCategoria(18, "filmes-drama")   // Drama
carregarCategoria(27, "filmes-terror")  // Terror