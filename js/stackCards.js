// ScrollTrigger modificado para os cards de stack
document.addEventListener('DOMContentLoaded', function() {
  // Registrar o plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Modificação para os cards de stack - só aparecem quando a div pai estiver no viewport
  const cards = document.querySelectorAll('.stack-item');
  const stickySpace = document.querySelector('.stack-offset');
  const stackWrapper = document.querySelector('.stack-wrapper');
  
  if (stackWrapper && cards.length > 0) {
    // Inicialmente, esconder todos os cards (exceto o primeiro)
    cards.forEach((card, index) => {
      if (index > 0) {
        gsap.set(card, { opacity: 0, y: index * card.offsetHeight });
      }
    });
    
    // Criar um ScrollTrigger para verificar quando a div pai entra no viewport
    const stackTrigger = ScrollTrigger.create({
      trigger: stackWrapper,
      start: "top 80%", // Começa quando o topo da div pai atinge 80% da viewport
      onEnter: () => {
        // Quando a div pai entrar no viewport, iniciar a animação dos cards
        initStackAnimation();
      },
      once: false // Permitir que a animação seja reiniciada se a div sair e entrar novamente no viewport
    });
    
    function initStackAnimation() {
      let cardHeight = cards[0].offsetHeight;
      const animation = gsap.timeline();
      
      // Configurar a animação para cada card
      cards.forEach((card, index) => {
        if (index > 0) {
          gsap.set(card, { y: index * cardHeight, opacity: 1 });
          animation.to(card, { y: 0, duration: index * 0.5, ease: "none" }, 0);
        }
      });
      
      // Criar o ScrollTrigger para a animação dos cards
      ScrollTrigger.create({
        trigger: stackWrapper,
        start: "top top",
        pin: true,
        end: () => `+=${(cards.length * cardHeight) + stickySpace.offsetHeight}`,
        scrub: true,
        animation: animation,
        invalidateOnRefresh: true
      });
    }
    
    // Atualizar as dimensões dos cards quando a janela for redimensionada
    ScrollTrigger.addEventListener("refreshInit", () => {
      if (stackTrigger.isActive) {
        let cardHeight = cards[0].offsetHeight;
        cards.forEach((card, index) => {
          if (index > 0) {
            gsap.set(card, { y: index * cardHeight, opacity: 1 });
          }
        });
      }
    });
  }
});
