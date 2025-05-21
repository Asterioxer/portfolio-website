<template>
  <section id="projects" class="section">
    <div class="container">
      <div class="section-header" ref="sectionHeader">
        <h2>My Projects</h2>
        <p>Check out some of my recent work</p>
      </div>
      
      <!-- Project Filters (if needed) -->
      <div class="project-filters" v-if="showFilters">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          :class="{ 'active': activeFilter === filter.id }"
          @click="filterProjects(filter.id)"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <!-- Projects Grid -->
      <div class="projects-grid" ref="projectsGrid">
        <div 
          v-for="(project, index) in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="{ 'visible': visibleProjects.includes(project.id) }"
          ref="projectCards"
          @mouseenter="handleProjectHover(index, true)"
          @mouseleave="handleProjectHover(index, false)"
        >
          <div class="project-img">
            <div 
              v-if="!project.image" 
              class="img-placeholder"
            >
              {{ project.title }}
            </div>
            <img 
              v-else 
              v-lazy="project.image" 
              :alt="project.title"
              @load="handleImageLoaded(project.id)"
            />
          </div>
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="project-links">
              <a 
                v-if="project.demoUrl" 
                :href="project.demoUrl" 
                class="btn btn-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Demo
              </a>
              <a 
                v-if="project.sourceUrl" 
                :href="project.sourceUrl" 
                class="btn btn-sm btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </a>
              <span 
                v-if="project.comingSoon" 
                class="btn btn-sm"
                :title="project.comingSoonTitle || 'Coming soon'"
              >
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'ProjectsSection',
  props: {
    // Enable or disable filtering (defaults to false)
    filtering: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // References to DOM elements
    const sectionHeader = ref(null);
    const projectsGrid = ref(null);
    const projectCards = ref([]);
    
    // Projects data
    const projects = reactive([
      {
        id: 'pixel-game',
        title: 'Pixel Web Game',
        description: 'An interactive pixel-based web game created using Kaboom.js, featuring engaging gameplay mechanics and responsive controls.',
        image: null, // No image specified
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Kaboom.js', 'Game Development'],
        demoUrl: '#',
        sourceUrl: 'https://github.com/Asterioxer/Project-game',
        visible: false
      },
      {
        id: 'pg-life',
        title: 'PG Life Project',
        description: 'A web application developed during Internshala training that helps users find PG accommodations with detailed property listings, user reviews, and comparison features.',
        image: null, // No image specified
        tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
        demoUrl: '#',
        sourceUrl: 'https://github.com/Asterioxer/Project-game',
        visible: false
      },
      {
        id: 'future-project',
        title: 'Coming Soon',
        description: 'A new project is currently in development. Check back soon for updates!',
        image: null, // No image specified
        tags: ['React', 'Node.js', 'Security'],
        comingSoon: true,
        comingSoonTitle: 'No action needed for this placeholder project',
        visible: false
      }
    ]);
    
    // State
    const activeFilter = ref('all');
    const visibleProjects = ref([]);
    const animationsInitialized = ref(false);
    
    // Filter options
    const filters = [
      { id: 'all', label: 'All Projects' },
      { id: 'web', label: 'Web Development' },
      { id: 'game', label: 'Game Development' },
      { id: 'security', label: 'Security' }
    ];
    
    // Computed properties
    const showFilters = computed(() => props.filtering && filters.length > 1);
    
    const filteredProjects = computed(() => {
      if (activeFilter.value === 'all') {
        return projects;
      } else {
        return projects.filter(project => {
          // Match based on tags or categories
          const matchesTags = project.tags.some(tag => 
            tag.toLowerCase().includes(activeFilter.value.toLowerCase())
          );
          const matchesTitle = project.title.toLowerCase().includes(activeFilter.value.toLowerCase());
          return matchesTags || matchesTitle;
        });
      }
    });
    
    // Methods
    function filterProjects(filterId) {
      activeFilter.value = filterId;
      
      // Reset animations when filter changes
      gsap.to(projectCards.value, { 
        opacity: 0, 
        y: 20, 
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          // After hiding, re-animate with new filtered projects
          nextTick(() => {
            animateProjectCards();
          });
        }
      });
    }
    
    function handleProjectHover(index, isEntering) {
      if (isEntering) {
        gsap.to(projectCards.value[index], {
          y: -10,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 217, 255, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(projectCards.value[index], {
          y: 0,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15), 0 0 5px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    
    function handleImageLoaded(projectId) {
      // Mark project as visible once image is loaded
      visibleProjects.value.push(projectId);
    }
    
    function animateProjectCards() {
      // Skip if not mounted yet
      if (!projectCards.value.length) return;
      
      // Animate cards sequentially
      gsap.fromTo(
        projectCards.value, 
        { 
          opacity: 0, 
          y: 50 
        }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform'
        }
      );
    }
    
    // Lifecycle hooks
    onMounted(async () => {
      // Initialize ScrollTrigger once DOM is ready
      await nextTick();
      
      // Add scroll-based animation
      if (!animationsInitialized.value) {
        // Animate section header
        gsap.from(sectionHeader.value, {
          scrollTrigger: {
            trigger: sectionHeader.value,
            start: 'top 80%',
            once: true
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            // Start project cards animation after header animation
            animateProjectCards();
          }
        });
        
        animationsInitialized.value = true;
      }
      
      // Mark projects as visible for those with no images
      projects.forEach(project => {
        if (!project.image) {
          visibleProjects.value.push(project.id);
        }
      });
    });
    
    return {
      sectionHeader,
      projectsGrid,
      projectCards,
      projects,
      filters,
      activeFilter,
      visibleProjects,
      showFilters,
      filteredProjects,
      filterProjects,
      handleProjectHover,
      handleImageLoaded
    };
  }
};
</script>

<style scoped>
/* Project section styles */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.project-card {
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), 
              box-shadow 0.5s cubic-bezier(0.19, 1, 0.22, 1),
              opacity 0.5s ease;
  position: relative;
  opacity: 0; /* Start invisible for animation */
  transform: translateY(30px);
  border: 1px solid var(--glass-border);
}

.project-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.project-img {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.project-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
}

.img-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -150%;
  }
  50%, 100% {
    left: 150%;
  }
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

.project-info h3::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.project-card:hover .project-info h3::after {
  width: 100%;
}

.project-info p {
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-tags span {
  background-color: rgba(0, 217, 255, 0.1);
  color: var(--primary-color);
  padding: 0.3rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.project-card:hover .project-tags span {
  background-color: rgba(0, 217, 255, 0.2);
}

.project-links {
  display: flex;
  gap: 0.8rem;
}

/* Project hover effects */
.project-card:hover .project-img img {
  transform: scale(1.05);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 217, 255, 0.2);
}

/* Project filter styles */
.project-filters {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.project-filters button {
  background-color: var(--light-dark-color);
  color: var(--text-light);
  border: 1px solid var(--glass-border);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.project-filters button:hover,
.project-filters button.active {
  background-color: var(--primary-color);
  color: var(--dark-color);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .project-filters {
    gap: 0.5rem;
  }
  
  .project-filters button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .project-info h3 {
    font-size: 1.3rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
