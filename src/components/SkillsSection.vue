<template>
  <section id="skills" class="section">
    <div class="container">
      <div class="section-header" ref="sectionHeader">
        <h2>My Skills</h2>
        <p>Technologies and tools I work with</p>
      </div>
      
      <div class="skills-container">
        <div 
          v-for="(category, categoryIndex) in skillCategories" 
          :key="category.name"
          class="skill-category"
          :class="{ 'visible': visibleCategories.includes(category.name) }"
          ref="skillCategories"
        >
          <h3>{{ category.name }}</h3>
          <div class="skills-list">
            <div 
              v-for="(skill, skillIndex) in category.skills" 
              :key="skill.name"
              class="skill-item"
              ref="skillItems"
            >
              <div class="skill-name-wrapper">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-percentage" ref="skillPercentages">
                  {{ Math.round(skill.tempPercentage) }}%
                </span>
              </div>
              <div class="skill-bar">
                <div 
                  class="skill-level" 
                  :style="{ width: skill.tempPercentage + '%' }"
                  :data-percentage="skill.percentage"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'SkillsSection',
  setup() {
    // References to DOM elements
    const sectionHeader = ref(null);
    const skillCategories = ref([]);
    const skillItems = ref([]);
    const skillPercentages = ref([]);
    
    // Tracking which categories are visible
    const visibleCategories = ref([]);
    
    // Skill categories and data
    const skillCategories = reactive([
      {
        name: 'Frontend',
        skills: [
          { name: 'HTML5', percentage: 90, tempPercentage: 0 },
          { name: 'CSS3', percentage: 85, tempPercentage: 0 },
          { name: 'JavaScript', percentage: 88, tempPercentage: 0 },
          { name: 'React', percentage: 82, tempPercentage: 0 },
          { name: 'Angular', percentage: 78, tempPercentage: 0 }
        ]
      },
      {
        name: 'Backend',
        skills: [
          { name: 'Node.js', percentage: 85, tempPercentage: 0 },
          { name: 'Express', percentage: 83, tempPercentage: 0 },
          { name: 'Django', percentage: 75, tempPercentage: 0 },
          { name: 'Flask', percentage: 72, tempPercentage: 0 },
          { name: 'MongoDB', percentage: 80, tempPercentage: 0 }
        ]
      },
      {
        name: 'Security',
        skills: [
          { name: 'Penetration Testing', percentage: 88, tempPercentage: 0 },
          { name: 'Vulnerability Assessment', percentage: 85, tempPercentage: 0 },
          { name: 'Ethical Hacking', percentage: 82, tempPercentage: 0 },
          { name: 'Security Audits', percentage: 86, tempPercentage: 0 }
        ]
      },
      {
        name: 'Cloud & Tools',
        skills: [
          { name: 'Google Cloud Platform', percentage: 85, tempPercentage: 0 },
          { name: 'Git', percentage: 90, tempPercentage: 0 },
          { name: 'Burp Suite', percentage: 84, tempPercentage: 0 },
          { name: 'OWASP ZAP', percentage: 83, tempPercentage: 0 }
        ]
      }
    ]);
    
    // Animate a single skill category
    function animateCategory(categoryIndex, delay = 0) {
      const category = skillCategories.value[categoryIndex];
      
      // Skip if already animated
      if (visibleCategories.value.includes(skillCategories[categoryIndex].name)) {
        return;
      }
      
      // Add to visible categories
      visibleCategories.value.push(skillCategories[categoryIndex].name);
      
      // Animate the category header
      gsap.fromTo(
        category.querySelector('h3'),
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          delay: delay
        }
      );
      
      // Animate each skill bar in this category
      const skills = category.querySelectorAll('.skill-item');
      
      gsap.fromTo(
        skills,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5, 
          ease: 'power2.out',
          delay: delay + 0.2,
          onComplete: () => {
            // Start skill level animation after the items appear
            animateSkillLevels(categoryIndex, delay + 0.4);
          }
        }
      );
    }
    
    // Animate the skill levels within a category
    function animateSkillLevels(categoryIndex, delay = 0) {
      const categorySkills = skillCategories[categoryIndex].skills;
      
      // Get all skill levels in this category
      const skillLevels = skillCategories.value[categoryIndex].querySelectorAll('.skill-level');
      const percentageElements = skillCategories.value[categoryIndex].querySelectorAll('.skill-percentage');
      
      // Start a counter animation for each skill
      categorySkills.forEach((skill, index) => {
        // Animate the skill bar and percentage counter
        gsap.to(skill, {
          tempPercentage: skill.percentage,
          duration: 1.5,
          delay: delay + (index * 0.1),
          ease: 'power2.out',
          onUpdate: function() {
            // Update is handled by Vue's reactivity
          }
        });
      });
    }
    
    // Initialize animations once component is mounted
    onMounted(async () => {
      // Initialize ScrollTrigger once DOM is ready
      await nextTick();
      
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
        ease: 'power2.out'
      });
      
      // Create scroll triggers for each skill category
      skillCategories.value.forEach((category, index) => {
        ScrollTrigger.create({
          trigger: category,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            animateCategory(index, index * 0.2);
          }
        });
      });
    });
    
    return {
      sectionHeader,
      skillCategories,
      skillItems,
      skillPercentages,
      visibleCategories
    };
  }
};
</script>

<style scoped>
/* Skills section styles */
.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.skill-category {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 0 5px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.skill-category.visible {
  opacity: 1;
  transform: translateY(0);
}

.skill-category:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 217, 255, 0.1);
}

.skill-category h3 {
  margin: 0 0 1.2rem;
  color: var(--text-color);
  font-size: 1.3rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.skill-category h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s ease;
}

.skill-category:hover h3::after {
  width: 100%;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  transition: transform 0.3s ease;
}

.skill-item:hover {
  transform: translateX(5px);
}

.skill-name-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
}

.skill-name {
  font-weight: 500;
  color: var(--text-color);
}

.skill-percentage {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 40px;
  text-align: right;
}

.skill-bar {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  overflow: hidden;
  position: relative;
}

.skill-level {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%);
  border-radius: 50px;
  width: 0; /* Initial width - will be animated */
  position: relative;
  transition: width 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.skill-level::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 5px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skills-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .skill-category {
    padding: 1.2rem;
  }
  
  .skill-category h3 {
    font-size: 1.2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .skills-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
