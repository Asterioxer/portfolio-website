<template>
  <header id="header" :class="{ 'scrolled': isScrolled }">
    <div class="container">
      <div class="logo">
        <h1>SOHAM</h1>
      </div>
      
      <nav>
        <ul :class="{ 'active': menuActive }">
          <li v-for="item in navItems" :key="item.id">
            <a 
              :href="'#' + item.id" 
              v-scroll-to="{ 
                el: '#' + item.id, 
                duration: 800, 
                offset: -80, 
                easing: 'ease-in-out'
              }"
              :class="{ 'active': activeSection === item.id }"
              @click="closeMenu"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
      
      <div 
        class="menu-toggle" 
        :class="{ 'active': menuActive }" 
        @click="toggleMenu"
        aria-label="Toggle navigation menu"
        :aria-expanded="menuActive"
      >
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export default {
  name: 'HeaderNav',
  setup() {
    // Reactive state
    const isScrolled = ref(false);
    const menuActive = ref(false);
    const activeSection = ref('hero');
    
    // Navigation items 
    const navItems = [
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'skills', label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' }
    ];

    // Toggle mobile menu
    const toggleMenu = () => {
      menuActive.value = !menuActive.value;
      
      // Animate menu items when opening
      if (menuActive.value) {
        gsap.fromTo(
          'nav ul li', 
          { 
            opacity: 0, 
            y: 15 
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: 'power2.out'
          }
        );
      }
    };
    
    // Close mobile menu
    const closeMenu = () => {
      menuActive.value = false;
    };

    // Handle scroll events
    const handleScroll = () => {
      // Change header style on scroll
      isScrolled.value = window.scrollY > 50;
      
      // Update active section based on scroll position
      updateActiveSection();
    };
    
    // Handle clicks outside nav to close menu
    const handleClickOutside = (event) => {
      if (menuActive.value && 
          !event.target.closest('nav') && 
          !event.target.closest('.menu-toggle')) {
        menuActive.value = false;
      }
    };
    
    // Update active nav item based on scroll position
    const updateActiveSection = () => {
      // Get all sections and determine which one is most visible
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'hero';
      let maxVisibility = 0;
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible in the viewport
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight > 0) ? visibleHeight / Math.min(rect.height, windowHeight) : 0;
        
        // Update active section if this one is more visible
        if (visibilityPercentage > maxVisibility && visibilityPercentage > 0.3) {
          maxVisibility = visibilityPercentage;
          currentSection = section.id;
        }
      });
      
      // Only update if section has changed (avoids unnecessary renders)
      if (activeSection.value !== currentSection) {
        activeSection.value = currentSection;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('click', handleClickOutside);
      
      // Initialize state
      handleScroll();
      
      // Animate header items on initial load
      gsap.fromTo(
        '.logo, nav ul li', 
        { y: -20, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2
        }
      );
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      isScrolled,
      menuActive,
      activeSection,
      navItems,
      toggleMenu,
      closeMenu
    };
  }
};
</script>

<style scoped>
/* Component-specific styles */
header {
  transition: all 0.3s ease;
}

.logo h1 {
  transition: all 0.3s ease;
}

header.scrolled {
  background-color: rgba(16, 16, 16, 0.95);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

header.scrolled .logo h1 {
  transform: scale(0.9);
}

/* Mobile menu animations */
@media (max-width: 768px) {
  nav ul {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    transform: translateY(-100%);
  }
  
  nav ul.active {
    transform: translateY(0);
  }
  
  nav ul li {
    opacity: 0;
    transform: translateY(15px);
  }
  
  .menu-toggle {
    transition: all 0.3s ease;
  }
  
  .menu-toggle.active {
    transform: rotate(90deg);
  }
}

/* Active link highlight with animated underline */
nav ul li a {
  position: relative;
  transition: color 0.3s ease;
}

nav ul li a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease, left 0.3s ease;
}

nav ul li a:hover::after,
nav ul li a.active::after {
  width: 100%;
  left: 0;
}

nav ul li a.active {
  color: var(--primary-color);
}
</style>

