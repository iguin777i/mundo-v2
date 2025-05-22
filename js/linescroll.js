gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const path = document.querySelector(".theLine");

  // Espera o usuário *não estar em cima do svg-stage* ou espera o scroll estabilizar
  waitForStableScroll(() => {
    initScrollLine(path);
  });
});

function initScrollLine(path) {
  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
  });

  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: "#svg-stage",
      start: "center center",
      end: "bottom center",
      scrub: true,
      markers: false,
      invalidateOnRefresh: true
    }
  });

  setTimeout(() => ScrollTrigger.refresh(), 500);
}

function waitForStableScroll(callback, delay = 300) {
  let lastScroll = window.scrollY;
  let stableFor = 0;

  const check = () => {
    const currentScroll = window.scrollY;
    if (Math.abs(currentScroll - lastScroll) < 2) {
      stableFor += 1;
      if (stableFor >= 3) {
        callback(); // Executa quando scroll estiver parado
        return;
      }
    } else {
      stableFor = 0;
      lastScroll = currentScroll;
    }
    setTimeout(check, delay);
  };

  check();
}

// Também atualiza em redimensionamento e rotação
window.addEventListener("resize", () => ScrollTrigger.refresh());
window.addEventListener("orientationchange", () => {
  setTimeout(() => ScrollTrigger.refresh(), 400);
});
