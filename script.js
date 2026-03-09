const banco = {
    animais: ["GATO", "CACHORRO", "LEÃO", "ELEFANTE", "MACACO"],
    objetos: ["CELULAR", "CADEIRA", "RELÓGIO", "GARRAFA"],
    filmes: ["TITANIC", "AVATAR", "VINGADORES"],
    frutas: ["MAÇÃ", "BANANA", "MORANGO", "ABACAXI"]
};

let categoriaAtual = "";
let palavras = [];
let indice = 0;
let tempo = 60;
let timer;
let resultados = [];
let jogando = false;
let acertos = 0;
let bloqueado = false;

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.style.display = "none");
    document.getElementById(id).style.display = "flex";
}

function selecionarCategoria(cat) {
    categoriaAtual = cat;
    document.getElementById("tema").innerText = cat.toUpperCase();
    mostrarTela("instrucao");
}

async function iniciarJogo() {

    // 🔥 Fullscreen
    if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
    }

    // 🔥 Travar paisagem
    if (screen.orientation && screen.orientation.lock) {
        try {
            await screen.orientation.lock("landscape");
        } catch (e) {}
    }

    palavras = [...banco[categoriaAtual]].sort(() => Math.random() - 0.5);
    indice = 0;
    tempo = 60;
    resultados = [];
    acertos = 0;
    jogando = false; // ainda não começa

    mostrarTela("jogo");

    document.getElementById("tempo").innerText = tempo;
    document.getElementById("placar").innerText = acertos;

    iniciarContagem();
}

function iniciarContagem() {
    const contador = document.getElementById("contadorInicial");
    let numero = 3;

    contador.style.display = "block";
    contador.innerText = numero;

    const intervaloContagem = setInterval(() => {
        numero--;
        contador.innerText = numero;

        contador.style.animation = "none";
        void contador.offsetWidth; // reinicia animação
        contador.style.animation = "zoom 1s ease";

        if (numero <= 0) {
            clearInterval(intervaloContagem);
            contador.style.display = "none";

            jogando = true; // 🔥 AGORA começa o jogo
            mostrarPalavra();
            iniciarTimer();
        }
    }, 1000);
}

function mostrarPalavra() {
    if (indice < palavras.length) {
        document.getElementById("palavra").innerText = palavras[indice];
    } else {
        finalizar();
    }
}

function iniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        tempo--;
        document.getElementById("tempo").innerText = tempo;

        if (tempo <= 0) {
            finalizar();
        }
    }, 1000);
}

function vibrar(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

function efeitoTela(classe) {
    document.body.classList.add(classe);
    setTimeout(() => {
        document.body.classList.remove(classe);
    }, 400);
}

function registrarResposta(status) {
    resultados.push({ nome: palavras[indice], status });

    if (status === "acertou") {
        acertos++;
        document.getElementById("placar").innerText = acertos;
    }

    indice++;
    mostrarPalavra();
}

function finalizar() {
    clearInterval(timer);
    jogando = false;

    document.getElementById("totalAcertos").innerText =
        "Você acertou " + acertos + " palavras!";

    const lista = document.getElementById("listaResultado");
    lista.innerHTML = "";

    resultados.forEach(item => {
        const p = document.createElement("p");
        p.innerText = item.nome;
        p.className = item.status;
        lista.appendChild(p);
    });

    mostrarTela("resultado");
}

function voltarInicio() {
    if (document.exitFullscreen) document.exitFullscreen();
    mostrarTela("categorias");
}

/* ============================= */
/* 🔥 SENSOR ESTILO APP REAL 🔥 */
/* ============================= */

window.addEventListener("deviceorientation", (event) => {
    if (!jogando) return;

    const beta = event.beta; // frente / trás

    // 🔒 Bloqueio até voltar posição neutra
    if (bloqueado) {
        if (Math.abs(beta) < 15) {
            bloqueado = false;
        }
        return;
    }

    // 👉 ACERTOU (inclina PARA CIMA)
    if (beta < -30) {
        bloqueado = true;

        vibrar(200);
        efeitoTela("acertouTela");
        registrarResposta("acertou");
    }

    // 👉 PASSOU (inclina PARA BAIXO)
    if (beta > 30) {
        bloqueado = true;

        vibrar([100, 100, 100]);
        efeitoTela("passouTela");
        registrarResposta("passou");
    }
    async function finalizar() {
    clearInterval(timer);
    jogando = false;

    // 🔥 Voltar para vertical
    if (screen.orientation && screen.orientation.lock) {
        try {
            await screen.orientation.lock("portrait");
        } catch (e) {}
    }

    // 🔥 Sair do fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }

    document.getElementById("totalAcertos").innerText =
        "Você acertou " + acertos + " palavras!";

    const lista = document.getElementById("listaResultado");
    lista.innerHTML = "";

    resultados.forEach(item => {
        const p = document.createElement("p");
        p.innerText = item.nome;
        p.className = item.status;
        lista.appendChild(p);
    });

    mostrarTela("resultado");
}
});