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

const jackpot = 1000;
const txt_jackpot = document.getElementById("prize");
txt_jackpot.textContent = `Premio actual: ${jackpot}€`;

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

let speed = 0; // Velocidad de la animación en milisegundos
let toBrake = false; // Variable para indicar si se debe frenar la velocidad de la animación
let offset = 0; // Desplazamiento inicial
let stripHeight = 0; // Altura total de la tira (se calculará dinámicamente más adelante)

function spinAnimation() {
  console.log("spinAnimation called");
  if (stripHeight === 0) {
    stripHeight = strips[0].scrollHeight; // Calcula la altura total de la tira si aún no se ha calculado
    console.log(stripHeight)
  }
  strips.forEach((strip) => {
    if (!toBrake && speed < 30) {
      speed += 3; // Aumenta la velocidad de la animación si se debe frenar
    } else {
      toBrake = true; // Indica que se debe frenar la velocidad de la animación
      speed *= 0.98; // Disminuye la velocidad de la animación si se debe frenar
    }

    offset += speed; // Incrementa el desplazamiento para cada tira
    if (offset >= stripHeight) {
      // Altura total de la tira
      offset -= stripHeight; // Reinicia el desplazamiento si supera la altura total de la tira
    }
    strip.style.transform = `translateY(-${offset}px)`;
  });
  if (speed > 0.5) {
    requestAnimationFrame(spinAnimation);
  } else {
    const simbolHeight = strips[0].querySelector("img").offsetHeight; // Altura de cada símbolo
    offset = Math.round(offset / simbolHeight) * simbolHeight; // Ajusta el desplazamiento al símbolo más cercano
    strips.forEach((strip) => {
      strip.style.transform = `translateY(-${offset}px)`; // Ajusta la posición final de cada tira
    });

    speed = 0; // Reinicia la velocidad de la animación
    toBrake = false; // Reinicia la variable de frenado
    //offset = 0; // Reinicia el desplazamiento
    isSpinning = false;
  }
}

let isSpinning = false;
document.getElementById("spin-button").addEventListener("click", () => {
  if (!isSpinning) {
    isSpinning = true;
    requestAnimationFrame(spinAnimation);
  }
});
stripHeight;
