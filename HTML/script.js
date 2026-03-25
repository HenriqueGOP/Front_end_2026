const petImg = document.getElementById("b");
const estrelas = document.getElementById("stars-container");
const timeOverlay = document.getElementById("time-overlay");
const seasonOverlay = document.getElementById("season-overlay");
const infoTempo = document.getElementById("info-tempo");
const statusTexto = document.getElementById("status-texto");

// Barras
const barFome = document.getElementById("bar-fome");
const barFelicidade = document.getElementById("bar-felicidade");
const barEstomago = document.getElementById("bar-estomago");

const estadosImagens = {
    normal:  "b_n.png",
    puto: "b_p.png",
    morto: "b_d.png",
    comendo: "b_c.png",
    alimentado: "b_a.png",
}

// Fallbacks de background corrigidos
const bgDia = "url('bg_d.png'), linear-gradient(to bottom, #87CEEB, #e0f6ff)";
const bgNoite = "url('bg_n.png'), linear-gradient(to bottom, #0B1021, #1B2735)";

// STATUS DO PET
let pet = {
    fome: 0,
    felicidade: 100,
    estomago: 0,
    vivo: true,
    estadoAtual: "normal",
    ocupado: false // impede spam de cliques enquanto come
};

let gameLoop = null;

// SISTEMA DE MUNDO
let horas = 6;  
let dias = 1;
let estacaoAtual = 0; 
let intervaloTempo = null;
const NOME_ESTACOES =["Primavera 🌸", "Verão ☀️", "Outono 🍂", "Inverno ❄️"];

// ----------------- LÓGICA DO PET -----------------

function iniciarPet() {
    if(gameLoop) clearInterval(gameLoop);
    
    gameLoop = setInterval(() => {
        if (!pet.vivo) return; // Se morreu, para o tempo para ele

        // Alterações naturais com o passar do tempo
        pet.fome += 2;          // Fome aumenta
        pet.felicidade -= 1.5;  // Fica solitário se não brincar
        pet.estomago -= 3;      // Faz a digestão

        // Limita os valores entre 0 e 100
        pet.fome = Math.max(0, Math.min(100, pet.fome));
        pet.felicidade = Math.max(0, Math.min(100, pet.felicidade));
        pet.estomago = Math.max(0, Math.min(100, pet.estomago));

        atualizarInterface();
        verificarEmocao();
        
    }, 1000); // 1 segundo real
}

function verificarEmocao() {
    if (!pet.vivo || pet.ocupado) return;

    // Reseta classes de animação/filtro
    petImg.className = "w-full max-w-md h-auto drop-shadow-2xl transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-105";

    // Regras de Sentimento (Ordem de prioridade importa!)
    if (pet.fome >= 100) {
        morrer();
    } 
    else if (pet.estomago >= 90) {
        pet.estadoAtual = "doente";
        petImg.src = estadosImagens.puto; // Usa cara de bravo
        petImg.classList.add("pet-doente"); // Aplica filtro verde/enjoo
        statusTexto.innerText = "Status: Passando Mal 🤢";
        statusTexto.className = "text-center font-bold text-sm mt-2 text-green-500";
    }
    else if (pet.fome > 70) {
        pet.estadoAtual = "puto";
        petImg.src = estadosImagens.puto;
        petImg.classList.add("pet-normal");
        statusTexto.innerText = "Status: Com Fome e Raiva 😡";
        statusTexto.className = "text-center font-bold text-sm mt-2 text-red-500";
    }
    else if (pet.felicidade < 30) {
        pet.estadoAtual = "triste";
        petImg.src = estadosImagens.normal;
        petImg.classList.add("pet-triste"); // Aplica filtro cinza/murcho
        statusTexto.innerText = "Status: Solitário e Triste 🥺";
        statusTexto.className = "text-center font-bold text-sm mt-2 text-gray-500";
    }
    else if (pet.felicidade >= 80 && pet.fome < 30) {
        pet.estadoAtual = "feliz";
        petImg.src = estadosImagens.alimentado; // Carinha fofa
        petImg.classList.add("pet-feliz"); // Adiciona brilho e pulinho
        statusTexto.innerText = "Status: Muito Feliz! 🥰";
        statusTexto.className = "text-center font-bold text-sm mt-2 text-pink-500";
    }
    else {
        pet.estadoAtual = "normal";
        petImg.src = estadosImagens.normal;
        petImg.classList.add("pet-normal");
        statusTexto.innerText = "Status: Normal 🙂";
        statusTexto.className = "text-center font-bold text-sm mt-2 text-primary";
    }
}

function atualizarInterface() {
    barFome.value = pet.fome;
    barFelicidade.value = pet.felicidade;
    barEstomago.value = pet.estomago;
}

// AÇÕES DO USUÁRIO

function alimentar() {
    if (pet.ocupado) return;

    if (!pet.vivo) {
        // RESSUSCITAR
        pet.vivo = true;
        pet.fome = 0;
        pet.felicidade = 50;
        pet.estomago = 0;
        pet.estadoAtual = "normal";
        petImg.src = estadosImagens.normal;
        statusTexto.innerText = "Status: Renasceu! ✨";
        return;
    }

    pet.ocupado = true;
    petImg.className = "w-full max-w-md h-auto drop-shadow-2xl"; // tira filtros pra comer
    petImg.src = estadosImagens.comendo;
    statusTexto.innerText = "Status: Comendo... 🍪";

    setTimeout(() => {
        pet.fome -= 30;
        pet.estomago += 35; // Enche o bucho
        pet.felicidade += 5; // Fica um pouco feliz
        
        // Corrige limites
        pet.fome = Math.max(0, pet.fome);
        pet.estomago = Math.min(100, pet.estomago);
        pet.felicidade = Math.min(100, pet.felicidade);

        petImg.src = estadosImagens.alimentado;
        atualizarInterface();

        setTimeout(() => {
            pet.ocupado = false;
            verificarEmocao(); // volta ao estado normal/doente
        }, 1500);

    }, 1500);
}

function fazerCarinho() {
    if (!pet.vivo || pet.ocupado) return;
    
    pet.felicidade += 15;
    pet.felicidade = Math.min(100, pet.felicidade);
    atualizarInterface();
    verificarEmocao();
    
    // Efeito visual rápido de coração/feliz
    petImg.classList.add("scale-110");
    setTimeout(() => petImg.classList.remove("scale-110"), 200);
}

function darRemedio() {
    if (!pet.vivo || pet.ocupado) return;

    if (pet.estadoAtual === "doente") {
        pet.estomago = 0; // Esvazia o estômago curando o enjoo
        pet.felicidade -= 10; // Remédio é ruim, tira felicidade
        statusTexto.innerText = "Status: Curado! 🏥";
        atualizarInterface();
        verificarEmocao();
    } else {
        alert("Ele não está doente! Guarde o remédio.");
    }
}

function morrer() {
    pet.vivo = false;
    pet.estadoAtual = "morto";
    petImg.className = "w-full max-w-md h-auto drop-shadow-xl grayscale";
    petImg.src = estadosImagens.morto;
    statusTexto.innerText = "Status: Morreu de Fome ☠️";
    statusTexto.className = "text-center font-bold text-sm mt-2 text-black";
    
    barFome.value = 100;
    barFelicidade.value = 0;
    barEstomago.value = 0;
}

// ----------------- SISTEMA DE MUNDO -----------------
function iniciarRelogio() {
    if (intervaloTempo) clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        horas++;
        if (horas >= 24) {
            horas = 0;
            dias++;
            if (dias % 2 !== 0) {
                estacaoAtual = (estacaoAtual + 1) > 3 ? 0 : estacaoAtual + 1;
            }
        }
        atualizarVisualMundo();
    }, 1000); 
}

function atualizarVisualMundo() {
    let periodoNome = "";
    
    if (horas >= 6 && horas < 12) {
        periodoNome = "Manhã";
        document.body.style.backgroundImage = bgDia;
        timeOverlay.style.backgroundColor = "transparent";
        estrelas.style.opacity = "0";
    } else if (horas >= 12 && horas < 18) {
        periodoNome = "Tarde";
        document.body.style.backgroundImage = bgDia;
        timeOverlay.style.backgroundColor = "rgba(255, 140, 0, 0.2)"; 
        estrelas.style.opacity = "0";
    } else if (horas >= 18 && horas < 24) {
        periodoNome = "Noite";
        document.body.style.backgroundImage = bgNoite;
        timeOverlay.style.backgroundColor = "rgba(10, 15, 35, 0.6)"; 
        estrelas.style.opacity = "1";
    } else {
        periodoNome = "Madrugada";
        document.body.style.backgroundImage = bgNoite;
        timeOverlay.style.backgroundColor = "rgba(2, 5, 15, 0.8)"; 
        estrelas.style.opacity = "1";
    }

    if (estacaoAtual === 0) {
        seasonOverlay.style.backgroundColor = "rgba(255, 180, 200, 0.05)";
        seasonOverlay.style.backdropFilter = "saturate(1.2)";
    } else if (estacaoAtual === 1) {
        seasonOverlay.style.backgroundColor = "rgba(255, 230, 100, 0.1)";
        seasonOverlay.style.backdropFilter = "saturate(1.4) contrast(1.05)";
    } else if (estacaoAtual === 2) {
        seasonOverlay.style.backgroundColor = "rgba(200, 100, 0, 0.15)";
        seasonOverlay.style.backdropFilter = "sepia(0.3) saturate(0.9)";
    } else if (estacaoAtual === 3) {
        seasonOverlay.style.backgroundColor = "rgba(100, 150, 255, 0.2)";
        seasonOverlay.style.backdropFilter = "saturate(0.6) brightness(0.9)";
    }

    infoTempo.innerText = `Dia ${dias} - ${periodoNome} (${horas}h) | ${NOME_ESTACOES[estacaoAtual]}`;
}

// Inicializando o jogo
iniciarPet();
iniciarRelogio();
atualizarVisualMundo();