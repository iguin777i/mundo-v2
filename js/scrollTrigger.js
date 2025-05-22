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

window.addEventListener("DOMContentLoaded", () => {
  waitForVideoReady();
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

window.addEventListener("orientationchange", () => {
  setTimeout(() => ScrollTrigger.refresh(), 500);
});

setTimeout(() => {
  ScrollTrigger.refresh();
}, 3000);