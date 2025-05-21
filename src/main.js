import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import VueScrollTo from 'vue-scrollto';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import App from './App.vue';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Import component sections for routing if needed
import HeroSection from './components/HeroSection.vue';
import AboutSection from './components/AboutSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import ExperienceSection from './components/ExperienceSection.vue';
import CertificationsSection from './components/CertificationsSection.vue';
import EducationSection from './components/EducationSection.vue';
import ContactSection from './components/ContactSection.vue';

// Configure routes - we'll use hash mode for better compatibility with static hosting
const routes = [
  { path: '/', component: HeroSection, name: 'home' },
  { path: '/about', component: AboutSection, name: 'about' },
  { path: '/projects', component: ProjectsSection, name: 'projects' },
  { path: '/skills', component: SkillsSection, name: 'skills' },
  { path: '/experience', component: ExperienceSection, name: 'experience' },
  { path: '/certifications', component: CertificationsSection, name: 'certifications' },
  { path: '/education', component: EducationSection, name: 'education' },
  { path: '/contact', component: ContactSection, name: 'contact' }
];

// Create router with enhanced scrolling behavior
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Handle hash links
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80 // Offset for fixed header
          });
        }, 500); // Small delay for transitions
      });
    } 
    // Return to saved position when using browser back/forward
    else if (savedPosition) {
      return savedPosition;
    } 
    // Scroll to top for new routes
    else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Add route navigation guard for page transitions
router.beforeEach((to, from, next) => {
  // Trigger animation before route change (optional)
  gsap.to('.page-transition', { 
    duration: 0.3, 
    opacity: 0, 
    onComplete: () => {
      // Continue navigation
      next();
    }
  });
});

router.afterEach((to, from) => {
  // Reset animation after route change (optional)
  gsap.to('.page-transition', { 
    duration: 0.3, 
    opacity: 1,
    delay: 0.1
  });
  
  // Update title based on route
  document.title = `SOHAM's Portfolio - ${to.name || 'Welcome'}`;
});

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(router);

// Configure scroll behavior
app.use(VueScrollTo, {
  container: 'body',
  duration: 800,
  easing: 'ease-in-out',
  offset: -80, // Offset for fixed header
  force: true,
  cancelable: true,
  onStart: function(element) {
    // Add "scrolling" class to body or specific elements (optional)
    document.body.classList.add('is-scrolling');
  },
  onDone: function() {
    // Remove "scrolling" class (optional)
    document.body.classList.remove('is-scrolling');
  },
  onCancel: function() {
    // Handle scroll cancellation (optional)
    document.body.classList.remove('is-scrolling');
  },
  x: false,
  y: true
});

// Register global directives 
app.directive('animate-on-scroll', {
  mounted(el, binding) {
    // Default animation values
    const delay = binding.value?.delay || 0;
    const duration = binding.value?.duration || 0.6;
    const from = binding.value?.from || { y: 50, opacity: 0 };
    const to = binding.value?.to || { y: 0, opacity: 1, ease: 'power2.out' };
    
    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, from, {
          ...to,
          duration: duration,
          delay: delay
        });
      }
    });
  }
});

// Mount app to the DOM
app.mount('#app');

// Initialize global animations (runs once on page load)
initGlobalAnimations();

function initGlobalAnimations() {
  // Animate on page load - elements with .animate-on-load class
  gsap.from('.animate-on-load', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.3
  });
  
  // Animate headers on scroll
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 80%', 
        once: true
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
  
  // Animate skill bars on scroll
  gsap.utils.toArray('.skill-item').forEach(skill => {
    const level = skill.querySelector('.skill-level');
    if (level) {
      const width = level.style.width;
      level.style.width = '0%';
      
      ScrollTrigger.create({
        trigger: skill,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(level, {
            width: width,
            duration: 1.5,
            ease: 'power2.out'
          });
        }
      });
    }
  });
  
  // Animate project cards on scroll
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
}
