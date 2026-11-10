const simbols = [
  { name: "siete", img: "/img/Siete.png", value: 40 },
  { name: "diamante", img: "/img/Diamante.png", value: 20 },
  { name: "campana", img: "/img/Campana.png", value: 10 },
  { name: "cereza", img: "/img/Cereza.png", value: 5 },
  { name: "chris", img: "/img/Chris.png", value: 2 },
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

let prizeInfo = document.getElementById("prize-info");

// Variable y bucle para crear las imágenes de los símbolos en cada tira
const strips = document.querySelectorAll(".strip");
let isSpinning = false; // Variable para controlar si la animación está en curso

let stripHeight = 0; // Altura total de la tira (se calculará dinámicamente más adelante)
let timeoutPrice; // Variable para almacenar el temporizador del mensaje de premio

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
const state = [
  { offset: 0, speed: 0, toBrake: false }, // Primera tira
  { offset: 0, speed: 0, toBrake: false }, // Segunda tira
  { offset: 0, speed: 0, toBrake: false }, // Tercera tira
];

const results = [];

function spinAnimation() {
  if (stripHeight === 0) {
    stripHeight = strips[0].scrollHeight; // Calcula la altura total de la tira si aún no se ha calculado
    console.log(stripHeight);
  }

  const simbolHeight = strips[0].querySelector("img").offsetHeight; // Altura de un símbolo individual

  const patron = simbolHeight * simbols.length; // 280
  const wrapAt = Math.floor((stripHeight - patron) / patron) * patron;

  strips.forEach((strip, index) => {
    const reel = state[index];

    if (!reel.toBrake && reel.speed < 30) {
      reel.speed += 3; // Aumenta la velocidad de la animación si se debe frenar
    } else {
      reel.toBrake = true; // Indica que se debe frenar la velocidad de la animación
      reel.speed *= 0.98; // Disminuye la velocidad de la animación si se debe frenar
    }

    reel.offset += reel.speed; // Incrementa el desplazamiento para cada tira
    if (reel.offset >= wrapAt) {
      reel.offset -= wrapAt; // Reinicia el desplazamiento si supera la altura total de la tira
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
    isSpinning = false; // La animación ha terminado
    // Cuando todas las tiras han frenado, se calcula el resultado final
    const [a, b, c] = results;
    if (a === b && b === c) {
      const winningSymbol = simbols[a];

      // Muestra el mensaje de premio ganado
      prizeInfo.textContent = `Has ganado: ${winningSymbol.value}€`;

      jackpot -= winningSymbol.value; // Suma el valor del símbolo ganador al jackpot
      coins += winningSymbol.value; // Suma el valor del símbolo ganador a las monedas del jugador

      clearTimeout(timeoutPrice); // Limpia el temporizador anterior si existe
      timeoutPrice = setTimeout(() => {
        prizeInfo.textContent = ""; // Limpia el mensaje de premio después de 2 segundos
      }, 2000);
    } else if (a === b || b === c || a === c) {
      const winningSymbol =
        simbols[a === b ? a : b === c ? b : a === c ? a : null];

      // Muestra el mensaje de premio ganado
      prizeInfo.textContent = `Has ganado: ${winningSymbol.value / 2}€`;

      jackpot -= winningSymbol.value / 2; // Suma la mitad del valor del símbolo ganador al jackpot
      coins += winningSymbol.value / 2; // Suma la mitad del valor del símbolo ganador a las monedas del jugador

      clearTimeout(timeoutPrice); // Limpia el temporizador anterior si existe
      timeoutPrice = setTimeout(() => {
        prizeInfo.textContent = ""; // Limpia el mensaje de premio después de 2 segundos
      }, 2000);
    } else {
      jackpot += 2; // Aumenta el jackpot en 2 monedas si no hay coincidencia
    }

    document.getElementById("coins").textContent = `Monedas: ${coins}€`;
    txt_jackpot.textContent = `Premio actual: ${jackpot}€`;

    // Todas las tiras han frenado
    state.forEach((reel) => {
      reel.offset = Math.floor(Math.random() * simbols.length) * simbolHeight; // Reinicia el desplazamiento de cada tira a una posición aleatoria
      reel.speed = 0;
      reel.toBrake = false;
      results.length = 0; // Reinicia el array de resultados para la próxima tirada
    });
  }
}

document.getElementById("spin-button").addEventListener("click", () => {
  if (isSpinning) return; // Evita que se inicie otra animación si ya hay una en curso
  if (coins < 2) {
    prizeInfo.textContent = "No hay monedas.";
    return; // Evita que se inicie la animación si no hay suficientes monedas
  } else {
    coins -= 2; // Resta 2 monedas por cada giro
    document.getElementById("coins").textContent = `Monedas: ${coins}€`;
    isSpinning = true;
    requestAnimationFrame(spinAnimation);
  }
});

document.getElementById("topUp").addEventListener("click", () => {
  coins += 10; // Añade 10 monedas al hacer clic en el botón de recarga
  document.getElementById("coins").textContent = `Monedas: ${coins}€`;
});
