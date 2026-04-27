function add() {
    const container = document.getElementById("Cards");
    const cardOriginal = container.querySelector(".card");

    const novoCard = cardOriginal.cloneNode(true);

    const img = novoCard.querySelector("img");
    img.src = "img/Lucas.webp";

    const nome = novoCard.querySelector(".nome");
    nome.textContent = "Lucas Paquetá";

    const rank = novoCard.querySelector(".badge");
    rank.textContent = "8,8";

    const spans = novoCard.querySelectorAll(".card-text span");
    spans[0].innerHTML = "<strong>Nascimento:</strong> 27/08/1997";
    spans[1].innerHTML = "<strong>Altura:</strong> 1,80 m";
    spans[2].innerHTML = "<strong>Posição:</strong> Meio-campista";

    container.appendChild(novoCard);
}