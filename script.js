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

    // 🔥 Tentar travar paisagem
    if (screen.orientation && screen.orientation.lock) {
        try {
            await screen.orientation.lock("landscape");
        } catch (e) { }
    }

    palavras = [...banco[categoriaAtual]].sort(() => Math.random() - 0.5);
    indice = 0;
    tempo = 60;
    resultados = [];
    acertos = 0;
    jogando = true;
    bloqueado = false;

    mostrarTela("jogo");
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("placar").innerText = acertos;

    mostrarPalavra();
    iniciarTimer();
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
/* 🔥 SENSOR CORRIGIDO PREMIUM */
/* ============================= */

window.addEventListener("deviceorientation", (event) => {
    if (!jogando) return;

    const gamma = event.gamma; // lado

    // 🔒 Se já executou ação, só libera quando voltar ao centro
    if (bloqueado) {
        if (Math.abs(gamma) < 10) {
            bloqueado = false;
        }
        return;
    }

    // 👉 ACERTOU (direita)
    if (gamma > 40) {
        bloqueado = true;

        vibrar(200);
        efeitoTela("acertouTela");
        registrarResposta("acertou");
    }

    // 👉 PASSOU (esquerda)
    if (gamma < -40) {
        bloqueado = true;

        vibrar([100, 100, 100]);
        efeitoTela("passouTela");
        registrarResposta("passou");
    }

    // ===============================
    // FINALIZAR
    // ===============================
    async function finalizarJogo() {
        jogoAtivo = false;
        clearInterval(intervalo);

        telaJogo.style.display = "none";
        telaResultado.style.display = "flex";

        listaAcertos.innerHTML = acertadas.map(a => `<li>${a}</li>`).join("");
        listaErros.innerHTML = erradas.map(e => `<li>${e}</li>`).join("");

        // VOLTAR PARA VERTICAL
        if (screen.orientation.unlock) {
            screen.orientation.unlock();
        }

        if (screen.orientation.lock) {
            try {
                await screen.orientation.lock("portrait");
            } catch (e) { }
        }

        // SAIR DA TELA CHEIA
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});