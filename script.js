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
let bloqueado = false; // 🔥 trava contra múltiplas leituras

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

  // 🔥 Tela cheia automática
  if (document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen();
  }

  // 🔥 Tenta travar em paisagem (nem todos celulares permitem)
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
  jogando = true;

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
  timer = setInterval(() => {
    tempo--;
    document.getElementById("tempo").innerText = tempo;
    if (tempo <= 0) finalizar();
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

/* 🔥 SENSOR COM BLOQUEIO */
window.addEventListener("deviceorientation", (event) => {
  if (!jogando || bloqueado) return;

  let beta = event.beta;

  if (beta > 45) { // ACERTOU
    bloqueado = true;

    vibrar(200);
    efeitoTela("acertouTela");

    resultados.push({ nome: palavras[indice], status: "acertou" });
    acertos++;
    document.getElementById("placar").innerText = acertos;

    indice++;
    mostrarPalavra();

    setTimeout(() => bloqueado = false, 1200); // 🔥 tempo mínimo entre ações
  }

  if (beta < -45) { // PASSOU
    bloqueado = true;

    vibrar([100, 100, 100]);
    efeitoTela("passouTela");

    resultados.push({ nome: palavras[indice], status: "passou" });

    indice++;
    mostrarPalavra();

    setTimeout(() => bloqueado = false, 1200);
  }
});