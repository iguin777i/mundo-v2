// ScrollTrigger final aprimorado para o vídeo Down the Rabbit Hole - Versão Bidirecional
document.addEventListener('DOMContentLoaded', function() {
  // Elementos principais
  const videoBlock = document.querySelector('.main-video-1');
  const video = videoBlock.querySelector('video');
  
  // Verificar se os elementos existem
  if (!videoBlock || !video) {
    console.error("Elementos de vídeo não encontrados");
    return;
  }
  
  // Remover atributos de autoplay e loop para garantir controle apenas via scroll
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
  let isExpanding = false;
  let isScrolling = false;
  let isReturning = false;
  let lastScrollDirection = 0; // 1 para baixo, -1 para cima, 0 para inicial
  let lastScrollProgress = 0;
  
  // Registrar o plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Garantir que o vídeo esteja carregado
  video.addEventListener('loadedmetadata', function() {
    videoDuration = video.duration;
    console.log("Vídeo carregado, duração:", videoDuration);
    
    // Inicializar ScrollTrigger após o vídeo estar carregado
    initScrollTrigger();
  });
  
  // Forçar carregamento do vídeo
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
    
    // Timeline para a expansão inicial - mais suave
    const expandTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: videoBlock,
        start: "top 80%", // Inicia quando o topo do vídeo atinge 80% da viewport
        end: "top 20%", // Termina quando o topo do vídeo atinge 20% da viewport
        scrub: 1, // Aumentar o valor para uma transição mais suave
        markers: false,
        onEnter: () => {
          isExpanding = true;
          videoBlock.classList.add('scrolling');
        },
        onLeaveBack: () => {
          isExpanding = false;
          videoBlock.classList.remove('scrolling');
          videoBlock.classList.remove('fullscreen');
          videoOverlay.classList.remove('active');
        },
        onComplete: () => {
          isExpanding = false;
        }
      }
    });
    
    // Animação de expansão - mais fluida
    expandTimeline.fromTo(videoBlock, 
      { 
        height: originalHeight,
        width: "100%",
        opacity: 1
      },
      { 
        height: window.innerHeight,
        width: "100%",
        opacity: 1,
        ease: "power2.inOut", // Ease mais suave
        onUpdate: function() {
          // Quando atingir 80% da expansão, adicionar classe fullscreen
          if (this.progress() > 0.8 && !videoBlock.classList.contains('fullscreen')) {
            videoBlock.classList.add('fullscreen');
            videoOverlay.classList.add('active');
            
            // Garantir que o vídeo esteja visível e centralizado
            gsap.to(video, {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              duration: 0.5,
              ease: "power2.out"
            });
          }
        }
      }
    );
    
    // ScrollTrigger para controlar o vídeo após a expansão - mais lento e suave
    // Agora com suporte bidirecional (subida e descida)
    const videoScrollTrigger = ScrollTrigger.create({
      trigger: videoBlock,
      start: "top 20%", // Começa onde a expansão termina
      end: `+=${videoDuration * 500}`, // Aumentar multiplicador para scroll mais lento
      scrub: 1.5, // Aumentar para transição mais suave
      pin: true, // Fixa o vídeo na tela durante o scroll
      pinSpacing: true,
      anticipatePin: 1, // Melhora a performance do pin
      markers: false,
      onEnter: () => {
        isScrolling = true;
        videoBlock.classList.add('fullscreen');
        videoOverlay.classList.add('active');
        
        // Garantir que o vídeo esteja visível e centralizado
        gsap.to(video, {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          duration: 0.5,
          ease: "power2.out"
        });
      },
      onUpdate: (self) => {
        // Detectar direção do scroll
        const currentProgress = self.progress;
        const direction = currentProgress > lastScrollProgress ? 1 : -1;
        
        // Atualizar variáveis de controle
        lastScrollDirection = direction;
        lastScrollProgress = currentProgress;
        
        // Atualizar o progresso do vídeo com base no scroll (bidirecional)
        if (videoDuration > 0 && isScrolling) {
          // Usar o progresso do scroll para definir o tempo do vídeo
          const videoTime = self.progress * videoDuration;
          
          // Aplicar o tempo do vídeo com interpolação suave
          gsap.to(video, {
            currentTime: videoTime,
            duration: 0.1,
            overwrite: true,
            ease: "none"
          });
        }
        
        // Verificar se o vídeo está próximo do fim para iniciar o fade out
        if (self.progress > 0.95) {
          if (!videoBlock.classList.contains('returning')) {
            videoBlock.classList.add('returning');
          }
        } else {
          if (videoBlock.classList.contains('returning')) {
            videoBlock.classList.remove('returning');
          }
        }
        
        // Log para debug
        console.log(`Scroll Direction: ${direction === 1 ? 'Down' : 'Up'}, Progress: ${self.progress.toFixed(2)}, Video Time: ${video.currentTime.toFixed(2)}`);
      },
      onLeave: () => {
        isScrolling = false;
        isReturning = true;
        
        // Iniciar o processo de ocultação
        videoBlock.classList.add('returning');
        
        // Fade out suave
        gsap.to(videoBlock, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            videoBlock.classList.add('hidden');
            videoBlock.classList.remove('fullscreen');
            videoOverlay.classList.remove('active');
          }
        });
      },
      onLeaveBack: () => {
        isScrolling = false;
      },
      onEnterBack: () => {
        // Remover classes de ocultação ao voltar
        videoBlock.classList.remove('hidden');
        videoBlock.classList.remove('returning');
        
        // Fade in suave
        gsap.to(videoBlock, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        // Garantir que estamos em modo de scrolling
        isScrolling = true;
      }
    });
    
    // Timeline para o retorno ao tamanho original - mais suave
    const returnTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: videoBlock,
        start: () => `+=${videoDuration * 500 + 100}`, // Começa logo após o fim do vídeo
        end: () => `+=${window.innerHeight * 1.5}`, // Duração do retorno mais longa
        scrub: 1, // Mais suave
        markers: false,
        onEnter: () => {
          isReturning = true;
          
          // Garantir que o vídeo esteja oculto
          videoBlock.classList.add('hidden');
        },
        onLeaveBack: () => {
          isReturning = false;
          
          // Remover ocultação ao voltar
          videoBlock.classList.remove('hidden');
          videoBlock.classList.remove('returning');
          
          // Restaurar visibilidade
          gsap.to(videoBlock, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              videoBlock.classList.add('fullscreen');
              videoOverlay.classList.add('active');
            }
          });
        },
        onComplete: () => {
          isReturning = false;
        }
      }
    });
    
    // Animação de retorno - mais suave
    returnTimeline.to(videoBlock, {
      height: originalHeight,
      width: "100%",
      opacity: 0, // Garantir que fique invisível
      ease: "power2.inOut", // Ease mais suave
      onStart: function() {
        videoBlock.classList.add('returning');
        videoBlock.classList.remove('fullscreen');
        videoOverlay.classList.remove('active');
      },
      onComplete: function() {
        videoBlock.classList.remove('scrolling');
        videoBlock.classList.remove('returning');
        videoBlock.classList.add('hidden');
        
        // Restaurar estilos originais
        gsap.set(video, {
          width: "100%",
          height: "100%",
          objectFit: "cover"
        });
        
        // Após um tempo, restaurar a visibilidade para o próximo ciclo
        setTimeout(() => {
          videoBlock.classList.remove('hidden');
          gsap.to(videoBlock, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
          });
        }, 500);
      }
    });
  }
  
  // Ajustar em caso de redimensionamento da janela
  window.addEventListener('resize', function() {
    originalHeight = videoBlock.offsetHeight;
    originalWidth = videoBlock.offsetWidth;
    ScrollTrigger.refresh();
  });
});
