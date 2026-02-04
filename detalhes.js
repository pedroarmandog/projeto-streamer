// Pegar o ID do filme da URL
const params = new URLSearchParams(window.location.search)
const movieId = params.get("id")

console.log("ID do filme:", movieId)

if (movieId) {
    carregarDetalhes(movieId)
    carregarTrailer(movieId)
} else {
    console.error("Nenhum ID de filme encontrado na URL")
}

// Carregar detalhes do filme
function carregarDetalhes(id) {
    const url = `${CONFIG.BASE_URL}/movie/${id}?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}`

    fetch(url)
        .then(res => res.json())
        .then(filme => {
            console.log("Detalhes do filme:", filme)

            const tituloEl = document.getElementById("titulo")
            const posterEl = document.getElementById("poster")
            const sinopseEl = document.getElementById("descricao")
            const notaEl = document.getElementById("nota")
            const lancEl = document.getElementById("data")

            if (tituloEl) tituloEl.innerText = filme.title || filme.name || "Título indisponível"
            
            if (posterEl) {
                if (filme.poster_path) {
                    posterEl.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                    posterEl.alt = filme.title || "Poster do filme"
                } else {
                    posterEl.src = "assets/no-poster.png"
                    posterEl.alt = "Sem poster disponível"
                }
            }

            if (sinopseEl) sinopseEl.innerText = filme.overview || "Sem descrição"

            if (notaEl) {
                const nota = (typeof filme.vote_average === "number") ? filme.vote_average.toFixed(1) : "—"
                notaEl.innerText = `⭐ ${nota}`
            }

            if (lancEl) {
            const dataAPI = filme.release_date || filme.first_air_date;
            
            if (dataAPI) {
                // Pega "2026-05-12", divide em partes, inverte e junta com barra
                const dataFormatada = dataAPI.split('-').reverse().join('/');
                lancEl.innerText = `📅 ${dataFormatada}`;
            } else {
                lancEl.innerText = "📅 —";
            }
        }

            const fundoBlur = document.getElementById("fundo-blur")
            if (fundoBlur && filme.backdrop_path) {
                fundoBlur.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${filme.backdrop_path})`
            }

            // preencher botão "Assistir" (prioriza homepage do filme; se não existir, aponta para a página do TMDB)
            const assistirEl = document.getElementById("assistir")
            if (assistirEl) {
                const paginaFilme = (filme && filme.homepage && filme.homepage.trim()) ? filme.homepage : `https://www.themoviedb.org/movie/${id}`
                assistirEl.href = paginaFilme
                assistirEl.target = "_blank"
                assistirEl.rel = "noopener"
                assistirEl.style.display = "inline-block"
            }

            buscarPlataformas(id)
        })
        .catch(error => {
            console.error("Erro ao carregar detalhes:", error)
        })

        
        
}



// Buscar plataformas de streaming
function buscarPlataformas(id) {
    const url = `${CONFIG.BASE_URL}/movie/${id}/watch/providers?api_key=${CONFIG.API_KEY}`

    fetch(url)
        .then(res => res.json())
        .then(dados => {
            console.log("Plataformas:", dados)

            const plataformasDiv = document.getElementById("plataformas")
            if (!plataformasDiv) return

            const resultados = (dados && dados.results) ? dados.results : {}
            const brasil = resultados.BR || null

            if (brasil && Array.isArray(brasil.flatrate) && brasil.flatrate.length > 0) {
                plataformasDiv.innerHTML = "<strong>Disponível em:</strong><br>"

                brasil.flatrate.forEach(plat => {
                    const logo = plat.logo_path ? `https://image.tmdb.org/t/p/w92${plat.logo_path}` : "assets/no-logo.png"
                    plataformasDiv.innerHTML += `
                        <img src="${logo}" 
                             alt="${plat.provider_name}" 
                             title="${plat.provider_name}"
                             style="width: 40px; margin: 5px; border-radius: 8px;">
                    `
                })
            } else {
                plataformasDiv.innerHTML = "<p>Plataformas não disponíveis no Brasil</p>"
            }
        })
        .catch(error => {
            console.error("Erro ao buscar plataformas:", error)
        })
}

// =====================
// CARREGAR TRAILER
// =====================

function carregarTrailer(id) {
    console.log("Buscando trailer para ID:", id)
    
    const url = `${CONFIG.BASE_URL}/movie/${id}/videos?api_key=${CONFIG.API_KEY}&language=pt-BR`

    fetch(url)
        .then(res => res.json())
        .then(dados => {
            console.log("Vídeos encontrados (PT-BR):", dados)

            const videos = (dados && Array.isArray(dados.results)) ? dados.results : []

            let trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube")
            
            if (!trailer) {
                trailer = videos.find(v => v.site === "YouTube")
            }

            if (trailer && trailer.key) {
                console.log("Trailer encontrado:", trailer.key)
                mostrarTrailer(trailer.key)
            } else {
                console.log("Nenhum trailer em PT-BR, tentando em inglês...")
                buscarTrailerIngles(id)
            }
        })
        .catch(error => {
            console.error("Erro ao buscar trailer:", error)
            buscarTrailerIngles(id)
        })
}

function buscarTrailerIngles(id) {
    const url = `${CONFIG.BASE_URL}/movie/${id}/videos?api_key=${CONFIG.API_KEY}&language=en-US`

    fetch(url)
        .then(res => res.json())
        .then(dados => {
            console.log("Vídeos encontrados (EN-US):", dados)

            const videos = (dados && Array.isArray(dados.results)) ? dados.results : []
            let trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube")
            
            if (!trailer) {
                trailer = videos.find(v => v.site === "YouTube")
            }

            if (trailer && trailer.key) {
                console.log("Trailer em inglês encontrado:", trailer.key)
                mostrarTrailer(trailer.key)
            } else {
                console.log("Nenhum trailer disponível")
                const tc = document.getElementById("trailer-container")
                if (tc) tc.innerHTML = "<p style='color: #888; padding: 20px;'>Trailer não disponível para este filme</p>"
            }
        })
        .catch(error => {
            console.error("Erro ao buscar trailer em inglês:", error)
            const tc = document.getElementById("trailer-container")
            if (tc) tc.innerHTML = "<p style='color: #888; padding: 20px;'>Erro ao carregar trailer</p>"
        })
}

function mostrarTrailer(videoKey) {
    console.log("Mostrando trailer com key:", videoKey)
    
    const trailerContainer = document.getElementById("trailer-container")
    
    if (!trailerContainer) {
        console.error("Elemento #trailer-container não encontrado")
        return
    }
    
    trailerContainer.innerHTML = `
        <iframe 
            width="100%" 
            height="450" 
            src="https://www.youtube.com/embed/${videoKey}?autoplay=0" 
            title="Trailer do Filme" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `
}

// ...existing code...