const simbols = [
  { name: "siete", img: "/img/Siete.png", value: 40 },
  { name: "diamante", img: "/img/Diamante.png", value: 20 },
  { name: "campana", img: "/img/Campana.png", value: 10 },
  { name: "cereza", img: "/img/Cereza.png", value: 5 },
];

const items = [
  document.getElementById("item1"),
  document.getElementById("item2"),
  document.getElementById("item3"),
];

let jackpot = 1000;
const txt_jackpot = document.getElementById("prize");
txt_jackpot.textContent = `Premio actual: ${jackpot}€`;

let coins = 10; // Variable para almacenar la cantidad de monedas del jugador
document.getElementById("coins").textContent = `Monedas: ${coins}€`;

// Variable y bucle para crear las imágenes de los símbolos en cada tira
const strips = document.querySelectorAll(".strip");

strips.forEach((strip) => {
  for (let i = 0; i < 3; i++) {
    simbols.forEach((simbol) => {
      const img = document.createElement("img");
      img.src = simbol.img;
      img.alt = simbol.name;
      strip.appendChild(img);
    });
  }
});

// Variables para la animación de las tiras

//let speed = 0; // Velocidad de la animación en milisegundos
//let toBrake = false; // Variable para indicar si se debe frenar la velocidad de la animación
//let offset = 0; // Desplazamiento inicial
const state = [
  { offset: 0, speed: 0, toBrake: false }, // Estado de la primera tira
  { offset: 0, speed: 0, toBrake: false }, // Estado de la segunda tira
  { offset: 0, speed: 0, toBrake: false }, // Estado de la tercera tira
];

let stripHeight = 0; // Altura total de la tira (se calculará dinámicamente más adelante)
const results = [];

function spinAnimation() {
  if (stripHeight === 0) {
    stripHeight = strips[0].scrollHeight; // Calcula la altura total de la tira si aún no se ha calculado
    console.log(stripHeight);
  }

  const simbolHeight = strips[0].querySelector("img").offsetHeight; // Altura de un símbolo individual

  strips.forEach((strip, index) => {
    const reel = state[index];

    if (!reel.toBrake && reel.speed < 30) {
      reel.speed += 3; // Aumenta la velocidad de la animación si se debe frenar
    } else {
      reel.toBrake = true; // Indica que se debe frenar la velocidad de la animación
      reel.speed *= 0.98; // Disminuye la velocidad de la animación si se debe frenar
    }

    reel.offset += reel.speed; // Incrementa el desplazamiento para cada tira
    if (reel.offset >= stripHeight) {
      // Altura total de la tira
      reel.offset -= stripHeight; // Reinicia el desplazamiento si supera la altura total de la tira
    }

    if (reel.speed > 0 && reel.speed < 0.5) {
      reel.offset = Math.round(reel.offset / simbolHeight) * simbolHeight;
      reel.speed = 0;
      results[index] = Math.floor(reel.offset / simbolHeight) % simbols.length; // Calcula el índice del símbolo final en la tira
    }

    strip.style.transform = `translateY(-${reel.offset}px)`;
  });

  if (state.some((reel) => reel.speed > 0.5)) {
    requestAnimationFrame(spinAnimation); // Continúa la animación si alguna tira aún tiene velocidad
  } else {
    const [a, b, c] = results;
    if (a === b && b === c) {
      const winningSymbol = simbols[a];
      jackpot -= winningSymbol.value; // Suma el valor del símbolo ganador al jackpot
      coins += winningSymbol.value; // Suma el valor del símbolo ganador a las monedas del jugador
    } else {
      jackpot += 2; // Aumenta el jackpot en 2 monedas si no hay coincidencia
    }
    document.getElementById("coins").textContent = `Monedas: ${coins}€`;
    document.getElementById("prize").textContent = `Premio actual: ${jackpot}€`;

    // Todas las tiras han frenado
    state.forEach((reel) => {
      reel.speed = 0;
      reel.toBrake = false;
    });
    isSpinning = false; // Indica que la animación ha terminado
  }
}

let isSpinning = false; // Variable para controlar si la animación está en curso
document.getElementById("spin-button").addEventListener("click", () => {
  if (!isSpinning && coins >= 2) {
    coins -= 2; // Resta 2 monedas por cada giro
    document.getElementById("coins").textContent = `Monedas: ${coins}€`;
    isSpinning = true;
    requestAnimationFrame(spinAnimation);
  }
});
