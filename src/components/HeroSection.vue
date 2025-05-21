<template>
  <section id="hero">
    <div class="hero-background">
      <div id="three-bg" ref="threeBg"></div>
      <div class="loading-indicator" :class="{ 'hidden': animationLoaded }"></div>
    </div>
    <div class="container">
      <div 
        class="hero-content" 
        ref="heroContent"
        :class="{ 'visible': contentVisible }"
      >
        <h1>Hello, I'm <span>SOHAM</span></h1>
        <p>Full Stack Developer & Security Analyst</p>
        <a 
          href="#contact" 
          v-scroll-to="{ 
            el: '#contact',
            duration: 800,
            offset: -80,
            easing: 'ease-in-out'
          }" 
          class="btn"
        >
          Get In Touch
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';

export default {
  name: 'HeroSection',
  setup() {
    // Reactive state
    const threeBg = ref(null);
    const heroContent = ref(null);
    const animationLoaded = ref(false);
    const contentVisible = ref(false);
    
    // Keep track of the particle background instance for cleanup
    let particleBackground = null;
    
    // Load Three.js animation when component is mounted
    onMounted(async () => {
      // Wait for the DOM to be fully rendered
      await nextTick();
      
      // Initialize Three.js animation
      loadThreeJsAnimation();
      
      // Add a listener for the animation completion event
      window.addEventListener('threeJsAnimationComplete', handleAnimationComplete);
      
      // Add fallback in case the animation takes too long
      setTimeout(() => {
        if (!contentVisible.value) {
          console.log('Animation fallback triggered');
          showContent();
        }
      }, 8000); // Fallback after 8 seconds
    });
    
    // Clean up resources when component is unmounted
    onUnmounted(() => {
      // Clean up Three.js resources
      if (window.particleBackground) {
        try {
          window.particleBackground.dispose();
        } catch (e) {
          console.error('Error cleaning up Three.js resources:', e);
        }
      }
      
      // Remove event listeners
      window.removeEventListener('threeJsAnimationComplete', handleAnimationComplete);
    });
    
    // Load Three.js animation
    async function loadThreeJsAnimation() {
      try {
        // Dynamically import the Three.js animation script
        const ThreeModule = await import('../../js/three-animation.js');
        
        console.log('Three.js animation loaded');
        
        // Mark animation as loaded once Three.js initializes
        setTimeout(() => {
          animationLoaded.value = true;
        }, 1000);
      } catch (error) {
        console.error('Error loading Three.js animation:', error);
        // Show content even if animation fails
        showContent();
      }
    }
    
    // Handle animation completion event
    function handleAnimationComplete() {
      console.log('Three.js animation complete');
      showContent();
    }
    
    // Show hero content with animation
    function showContent() {
      // Skip if content is already visible
      if (contentVisible.value) return;
      
      contentVisible.value = true;
      
      // Animate hero content
      gsap.fromTo(
        heroContent.value, 
        {
          y: 30,
          opacity: 0,
          scale: 0.95,
        }, 
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5, // Add small delay for smoother appearance
          onComplete: () => {
            // Dispatch event to notify that hero section is fully loaded and visible
            window.dispatchEvent(new CustomEvent('heroContentVisible'));
          }
        }
      );
    }
    
    return {
      threeBg,
      heroContent,
      animationLoaded,
      contentVisible
    };
  }
};
</script>

<style scoped>
/* Component-specific styles */
#hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  /* Initial state for animation */
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.hero-content.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-content h1 span {
  color: var(--primary-color);
  position: relative;
  display: inline-block;
}

.hero-content h1 span::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.5s;
}

.hero-content.visible h1 span::after {
  transform: scaleX(1);
  transform-origin: left;
}

.loading-indicator {
  opacity: 1;
  transition: opacity 0.6s ease;
}

.loading-indicator.hidden {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
}
</style>
