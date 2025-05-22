// Hero e ScrollTrigger Integration
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const heroIntro = document.querySelector('.hero-intro');
    const videoBackground = document.querySelector('.video-background');
    const startExperience = document.getElementById('start-experience');
    
    // Variáveis de controle
    let heroVisible = true;
    let videoPlaying = false;
    let scrollPosition = 0;
    
    // Função para ocultar a hero e mostrar o vídeo
    function hideHeroShowVideo() {
      if (heroVisible) {
        heroIntro.classList.add('hidden');
        heroVisible = false;
        
        // Garantir que o vídeo esteja visível
        videoBackground.style.opacity = 1;
        
        // Iniciar o vídeo se ainda não estiver tocando
        if (!videoPlaying) {
          videoBackground.play();
          videoPlaying = true;
        }
      }
    }
    
    // Função para mostrar a hero e ocultar o vídeo
    function showHeroHideVideo() {
      if (!heroVisible && window.scrollY < 50) {
        heroIntro.classList.remove('hidden');
        heroVisible = true;
      }
    }
    
    // Evento de clique no indicador de scroll
    startExperience.addEventListener('click', function() {
      hideHeroShowVideo();
      
      // Scroll suave para o início do conteúdo
      window.scrollTo({
        top: 100,
        behavior: 'smooth'
      });
    });
    
    // Evento de scroll para controlar a visibilidade da hero
    window.addEventListener('scroll', function() {
      // Detectar direção do scroll
      const currentScrollPosition = window.scrollY;
      
      // Scroll para baixo
      if (currentScrollPosition > scrollPosition) {
        if (currentScrollPosition > 50) {
          hideHeroShowVideo();
        }
      } 
      // Scroll para cima
      else {
        if (currentScrollPosition < 50) {
          showHeroHideVideo();
        }
      }
      
      // Atualizar posição de scroll
      scrollPosition = currentScrollPosition;
    });
    
    // Criar um ScrollTrigger para controlar a visibilidade da hero
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "50px top",
      onEnter: () => hideHeroShowVideo(),
      onEnterBack: () => showHeroHideVideo(),
      markers: false
    });
    
    // Garantir que o ScrollTrigger do vídeo continue funcionando
    // Não interferimos com a lógica existente em scrollTrigger.js
  });
  