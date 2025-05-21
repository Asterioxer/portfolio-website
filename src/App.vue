<template>
  <div class="app-container">
    <!-- Navigation Header -->
    <header-nav />
    
    <!-- Main Content with Route Transitions -->
    <main class="page-transition">
      <!-- Option 1: SPA with router-view -->
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
          @before-enter="beforeEnter"
          @after-leave="afterLeave"
        >
          <component :is="Component" />
        </transition>
      </router-view>
      
      <!-- Option 2: All sections on single page (enabled by default) -->
      <template v-if="singlePageMode">
        <hero-section id="hero" class="section-animate" />
        <about-section id="about" class="section-animate" />
        <projects-section id="projects" class="section-animate" />
        <skills-section id="skills" class="section-animate" />
        <experience-section id="experience" class="section-animate" />
        <certifications-section id="certifications" class="section-animate" />
        <education-section id="education" class="section-animate" />
        <contact-section id="contact" class="section-animate" />
      </template>
    </main>
    
    <!-- Footer -->
    <footer>
      <div class="container">
        <p>&copy; {{ currentYear }} SOHAM. All Rights Reserved.</p>
        <div class="footer-links">
          <a href="#about" v-scroll-to="'#about'">About</a>
          <a href="#projects" v-scroll-to="'#projects'">Projects</a>
          <a href="#skills" v-scroll-to="'#skills'">Skills</a>
          <a href="#experience" v-scroll-to="'#experience'">Experience</a>
          <a href="#certifications" v-scroll-to="'#certifications'">Certifications</a>
          <a href="#education" v-scroll-to="'#education'">Education</a>
          <a href="#contact" v-scroll-to="'#contact'">Contact</a>
        </div>
      </div>
    </footer>
    
    <!-- Scroll to top button -->
    <div 
      class="scroll-to-top" 
      :class="{ 'visible': showScrollTop }"
      @click="scrollToTop"
    >
      <i class="fas fa-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import components
import HeaderNav from './components/HeaderNav.vue';
import HeroSection from './components/HeroSection.vue';
import AboutSection from './components/AboutSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import ExperienceSection from './components/ExperienceSection.vue';
import CertificationsSection from './components/CertificationsSection.vue';
import EducationSection from './components/EducationSection.vue';
import ContactSection from './components/ContactSection.vue';

export default {
  name: 'App',
  components: {
    HeaderNav,
    HeroSection,
    AboutSection,
    ProjectsSection,
    SkillsSection,
    ExperienceSection,
    CertificationsSection,
    EducationSection,
    ContactSection
  },
  setup() {
    // State for UI control
    const singlePageMode = ref(true); // Set to true for single page mode, false for router mode
    const showScrollTop = ref(false);
    const scrollThreshold = 300; // Show scroll-to-top after scrolling this many pixels
    
    // Compute current year for footer copyright
    const currentYear = computed(() => new Date().getFullYear());
    
    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      
      // Initialize scroll animations for sections
      initSectionAnimations();
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });
    
    // Transition hooks
    function beforeEnter(el) {
      // Animation before a component enters
      gsap.set(el, { 
        opacity: 0,
        y: 20
      });
    }
    
    function afterLeave() {
      // Callback after a component has left
      // Useful for cleanup or state resets
    }
    
    // Scroll handlers
    function handleScroll() {
      // Show/hide scroll-to-top button
      showScrollTop.value = window.scrollY > scrollThreshold;
    }
    
    function scrollToTop() {
      // Scroll to top with smooth animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Initialize scroll animations for sections
    function initSectionAnimations() {
      // Register ScrollTrigger if needed
      if (!ScrollTrigger.isRegistered) {
        gsap.registerPlugin(ScrollTrigger);
      }
      
      // Add scroll animations to each section
      gsap.utils.toArray('.section-animate').forEach((section, index) => {
        // Create staggered entrance for sections
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            // Animate section entrance
            gsap.fromTo(
              section.querySelectorAll('.section-header, .animate-on-scroll'),
              { 
                y: 50, 
                opacity: 0 
              },
              { 
                y: 0, 
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
              }
            );
          }
        });
      });
    }
    
    return {
      singlePageMode,
      showScrollTop,
      currentYear,
      beforeEnter,
      afterLeave,
      scrollToTop
    };
  }
};
</script>

<style>
/* Global styles */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Transitions for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Section animation class */
.section-animate {
  overflow: hidden;
}

/* Scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-to-top:hover {
  background-color: var(--secondary-color);
  transform: translateY(-5px);
}

/* Page transition container */
.page-transition {
  transition: opacity 0.3s ease;
}

/* Inherit existing CSS from your styles.css */
</style>
