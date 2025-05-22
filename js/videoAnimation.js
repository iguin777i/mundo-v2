// ScrollTrigger final para o vídeo Down the Rabbit Hole
document.addEventListener('DOMContentLoaded', function() {
  // Elementos principais
  const videoBlock = document.querySelector('.main-video-1');
  const video = videoBlock.querySelector('video');
  
  // Verificar se os elementos existem
  if (!videoBlock || !video) {
    console.error("Elementos de vídeo não encontrados");
    return;
  }
  
  // Atualizar o src do vídeo para o novo arquivo
  video.src = "./img/backgrounds/Down the Rabbit Hole - scrolltrigger-1920.webm";
  
  // Remover atributos de autoplay e loop
  video.removeAttribute('autoplay');
  video.removeAttribute('loop');
  video.muted = true; // Manter mudo para melhor experiência
  
  // Criar elemento de progresso
  const videoProgress = document.createElement('div');
  videoProgress.className = 'video-progress';
  videoBlock.appendChild(videoProgress);
  
  // Criar overlay
  const videoOverlay = document.createElement('div');
  videoOverlay.className = 'video-overlay';
  document.body.appendChild(videoOverlay);
  
  // Variáveis de controle
  let videoDuration = 0;
  let originalHeight = videoBlock.offsetHeight;
  let originalWidth = videoBlock.offsetWidth;
  let originalPosition = null;
  let scrollTriggerInstance = null;
  
  // Registrar o plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Garantir que o vídeo esteja carregado
  video.addEventListener('loadedmetadata', function() {
    videoDuration = video.duration;
    console.log("Vídeo carregado, duração:", videoDuration);
    
    // Inicializar ScrollTrigger após o vídeo estar carregado
    initScrollTrigger();
  });
  
  // Carregar o vídeo manualmente
  video.load();
  
  // Função para atualizar a barra de progresso do vídeo
  function updateVideoProgress() {
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      videoProgress.style.width = `${progress}%`;
    }
  }
  
  // Evento para atualizar o progresso do vídeo
  video.addEventListener('timeupdate', updateVideoProgress);
  
  // Função para inicializar o ScrollTrigger
  function initScrollTrigger() {
    // Salvar posição original para referência
    originalPosition = videoBlock.getBoundingClientRect();
    
    // ScrollTrigger principal para controlar a expansão e o vídeo
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: videoBlock,
      start: "top 80%", // Inicia quando o topo do vídeo atinge 80% da viewport
      end: "bottom -100%", // Termina bem depois do vídeo para dar espaço para o scroll
      scrub: 0.5, // Sincroniza com o scroll com um pequeno atraso para suavizar
      pin: true, // Fixa o vídeo na tela durante o scroll
      pinSpacing: true,
      anticipatePin: 1, // Melhora a performance do pin
      markers: false,
      onEnter: () => {
        // Quando o vídeo entra na viewport
        console.log("Vídeo entrou na viewport");
        // Garantir que o vídeo esteja pausado inicialmente
        video.pause();
      },
      onUpdate: (self) => {
        // Atualizar o progresso do vídeo com base no scroll
        if (videoDuration > 0) {
          // Usar o progresso do scroll para definir o tempo do vídeo
          const videoTime = self.progress * videoDuration;
          
          // Aplicar o tempo do vídeo
          if (Math.abs(video.currentTime - videoTime) > 0.1) {
            video.currentTime = videoTime;
          }
        }
        
        // Expandir para tela cheia quando estiver no centro da viewport
        if (self.progress > 0.1 && self.progress < 0.9) {
          if (!videoBlock.classList.contains('fullscreen')) {
            videoBlock.classList.add('fullscreen');
            videoOverlay.classList.add('active');
          }
        } else {
          if (videoBlock.classList.contains('fullscreen')) {
            videoBlock.classList.remove('fullscreen');
            videoOverlay.classList.remove('active');
          }
        }
      },
      onLeave: () => {
        // Quando o usuário rola para além do vídeo
        videoBlock.classList.remove('fullscreen');
        videoOverlay.classList.remove('active');
      },
      onEnterBack: () => {
        // Quando o usuário rola de volta para o vídeo
        console.log("Vídeo entrou novamente na viewport");
      }
    });
  }
  
  // Ajustar em caso de redimensionamento da janela
  window.addEventListener('resize', function() {
    if (scrollTriggerInstance) {
      // Atualizar valores originais
      originalHeight = videoBlock.offsetHeight;
      originalWidth = videoBlock.offsetWidth;
      
      // Atualizar ScrollTrigger
      ScrollTrigger.refresh();
    }
  });
  
  // Prevenir qualquer comportamento que possa causar reprodução automática
  video.addEventListener('play', function(e) {
    // Se não estiver sendo controlado pelo ScrollTrigger, pausar
    if (!scrollTriggerInstance || !scrollTriggerInstance.isActive) {
      video.pause();
    }
  });
});
