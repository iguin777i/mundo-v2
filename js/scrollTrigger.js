console.clear();

gsap.registerPlugin(ScrollTrigger);

const video = document.querySelector(".video-background");
let src = video.currentSrc || video.src;
let scroll = 0;
let scrollTarget = 0;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Ativa o vídeo em iOS
function once(el, event, fn, opts) {
  const onceFn = function (e) {
    el.removeEventListener(event, onceFn);
    fn.apply(this, arguments);
  };
  el.addEventListener(event, onceFn, opts);
  return onceFn;
}

once(document.documentElement, "touchstart", () => {
  video.play();
  video.pause();
});

function initScrollVideo() {
  // Evita múltiplas execuções
  if (video.dataset.scrollInit) return;
  video.dataset.scrollInit = "true";

  ScrollTrigger.create({
    trigger: "#container",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      scrollTarget = self.progress;
    }
  });

  // Animação contínua
  function update() {
    scroll += (scrollTarget - scroll) * 0.3;

    if (Math.abs(scrollTarget - scroll) < 0.001) {
      scroll = scrollTarget;
    }

    if (video.duration) {
      video.currentTime = scroll * video.duration;
    }

    requestAnimationFrame(update);
  }

  update();
}

// Garante que ScrollTrigger funcione mesmo que o vídeo demore para carregar
function waitForVideoReady(maxAttempts = 10) {
  let attempts = 0;
  const interval = setInterval(() => {
    if (video.readyState >= 2 && video.duration > 0) {
      clearInterval(interval);
      initScrollVideo();
    } else if (++attempts >= maxAttempts) {
      console.warn("Forçando inicialização mesmo sem readyState ideal");
      clearInterval(interval);
      initScrollVideo();
    }
  }, 200);
}

// Aguarda DOM e vídeo carregado
window.addEventListener("DOMContentLoaded", () => {
  waitForVideoReady();
});

// Corrige blob para desktop (fluidez extra)
if (!isMobile) {
  setTimeout(() => {
    if (window.fetch) {
      fetch(src)
        .then((response) => response.blob())
        .then((response) => {
          const blobURL = URL.createObjectURL(response);
          const t = video.currentTime;

          video.setAttribute("src", blobURL);
          video.load();

          video.addEventListener("canplay", () => {
            video.currentTime = t + 0.01;
            waitForVideoReady();
          }, { once: true });
        });
    }
  }, 1000);
}

// Corrige resize, rotação e restaura scroll
window.addEventListener("orientationchange", () => {
  setTimeout(() => ScrollTrigger.refresh(), 500);
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

// Backup: força refresh 3s após carregamento (usuário rolou durante o loading)
setTimeout(() => {
  ScrollTrigger.refresh();
}, 3000);
