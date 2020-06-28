const API_KEY = 'd5166b0bfbb44a6693e30d7af18c8045';
var tema = document.getElementById('tema');

onload = () => {
    let exclusivo = new XMLHttpRequest();
    exclusivo.onload = noticiasAPI, tema.innerHTML = '<u>Principais notícias</u>';
    exclusivo.onerror = err => console.log(err);
    exclusivo.open('GET', `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&lang=pt&country=br`)
    exclusivo.send();

    if (window.location.hostname != "localhost") {
        window.location.href = `${window.location.protocol}//localhost:${window.location.port}/index.html`;
    }

    exibeTags();
    addEvents();
}

//Função preencher pesquisas
function noticiasAPI() {
    let news = JSON.parse(this.responseText);
    let exclusive = document.getElementById('exclusivo');
    let gradeNews = document.getElementById('gradeNews');

    if(news.totalResults == 0){
        alert("Não foram encontradas notícias para este assunto. Iremos te redirecionar para a pagina principal.");
        location.href = '/';
    }

    let textExclusive = '';
    let textNews = '';
    let contExclusive = 0;



    for (i = 0; i < news.articles.length; i++) {
        let data = new Date(news.articles[i].publishedAt);

        if (news.articles[i].urlToImage != null && contExclusive < 1 && textExclusive == '') {
            textExclusive += `
                        <div class="col-xs-12 col-md-6 destaque_img">
                            <img src="${news.articles[i].urlToImage}" class="exclusive">
                            <h4 class="text-block">Exclusivo</h4>
                        </div>
                        <div class="col-xs-12 col-md-6 exclusive_text pNewsAPI">
                            <div>    
                                <p>${data.toLocaleDateString() != null ? (data.toLocaleDateString()) : ""}
                                ${news.articles[i].source.name != null ? (" - " + news.articles[i].source.name) : ""}
                                ${news.articles[i].author != null ? (" - " + news.articles[i].author) : ""}</p>
                                <h2>${news.articles[i].title.split(" - ")[0]}</h2>
                                <p>${news.articles[i].content}</p>
                            </div>
                            <div class="cont d-flex align-items-end">
                                <a class="btn btn-outline-warning" href="${news.articles[i].url}">Continuar lendo</a>
                            </div>
                        </div>
                    `;
            contExclusive++;
        } else if (news.articles[i].urlToImage != null) {
            textNews += `
                    <div class="card cards-news">
                        <img class="card-img-top" src="${news.articles[i].urlToImage}" alt="Card image cap">
                        <ul class="list-group list-group-flush datahora">
                            <li class="list-group-item">${data.toLocaleDateString()} - 
                            ${news.articles[i].source.name} - 
                            ${news.articles[i].author}</li>
                        </ul>
                        <div class="card-body">
                            <h5 class="card-title">${news.articles[i].title.split(" - ")[0]}</h5>
                            <p class="card-text">${news.articles[i].content}</p>
                        </div>
                        <div class="card-body">
                            <a class="btn btn-outline-warning" href="${news.articles[i].url}">Continuar lendo</a>
                        </div>
                    </div>
                `;
        }
    }
    exclusive.innerHTML = textExclusive;
    gradeNews.innerHTML = textNews;
}

// Pesquisa por seção:
function executaPesquisa() {
    let fonte = this.id;
    let texto = this.text;

    if(this.classList.contains("tag")){
        let xhr = new XMLHttpRequest();
        xhr.onload = noticiasAPI, tema.innerHTML = `Tema: <u>${fonte}</u>`;
        xhr.open('GET', `https://newsapi.org/v2/top-headlines?q=${fonte}&apiKey=${API_KEY}&lang=pt`);
        xhr.send();
    }else{
        let xhr = new XMLHttpRequest();
        xhr.onload = noticiasAPI, tema.innerHTML = `<u>${texto}</u>`;
        xhr.open('GET', `https://newsapi.org/v2/top-headlines?sources=${fonte}&apiKey=${API_KEY}&lang=pt`);
        xhr.send();
    }

    
}

// Pesquisa por input
function executarPesquisa() {
    let query = document.getElementById('txtPesquisa').value;

    let xhr = new XMLHttpRequest();
    xhr.onload = noticiasAPI, tema.innerHTML = `Tema: <u>${query}</u>`;
    xhr.open('GET', `https://newsapi.org/v2/top-headlines?q=${query}&apiKey=${API_KEY}&lang=pt`);
    xhr.send();
}

function exibeTags() {
    let tagsList = JSON.parse(localStorage.getItem('tags'));
    if (tagsList) {
        let tagsMenu = document.getElementById('tagsMenu');
        let nav = document.getElementById('navbarSupportedContent');
        let ul = nav.getElementsByTagName('ul')[0];

        let texto = '';

        texto += `
            <li id="tagsMenu" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navTags" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Tags
                </a>
                <div class="dropdown-menu" aria-labelledby="navTags">
        `;
        for (let i = 0; i < tagsList.length; i++) {
            texto += `
                <a class="dropdown-item tag" id="${tagsList[i].tag}">${tagsList[i].tag}</a>
            `;
        }
        texto += `
                </div>
            </li>
        `;

        if (!tagsMenu)
            ul.innerHTML += texto;
        else {
            tagsMenu.innerHTML = texto;
        }

    }
}

// Adiciona dados no localStorage
function adicionaTag() {
    let textoTag = document.getElementById('txtPesquisa').value;
    let tags = JSON.parse(localStorage.getItem('tags'));

    if (textoTag.trim() != "") {
        if (!tags) { // Verifica se já existe uma tag adicionada
            let obj = [{
                tag: textoTag
            }];
            localStorage.setItem('tags', JSON.stringify(obj));
        } else { // Adiciona nova tag
            tags.push({
                tag: textoTag
            });
            localStorage.setItem('tags', JSON.stringify(tags));
        }
    } else {
        alert("Escreva algo no campo para adicionar uma tag")
        return false;
    }

    textoTag = '';

    location.reload();
}

function addEvents(){
    document.querySelectorAll(".dropdown-menu a").forEach(function (opt) {
        opt.addEventListener("click", executaPesquisa);
    });
    
    document.getElementById('btnPesquisa').addEventListener('click', executarPesquisa);
    document.getElementById('addTag').addEventListener('click', adicionaTag);
}