<template>
  <section id="about" class="section">
    <div class="container">
      <div class="section-header" ref="sectionHeader">
        <h2>About Me</h2>
        <p>Here's a little bit about who I am and what I do</p>
      </div>
      <div class="about-content">
        <div class="about-img" ref="aboutImage">
          <!-- Profile image -->
          <img src="/images/Screenshot 2025-05-04 083011.png" alt="Soham Mukherjee - Full Stack Developer and Security Analyst" class="profile-image">
        </div>
        <div class="about-text" ref="aboutText">
          <h3>Who am I?</h3>
          <p>I am a Full Stack Developer and Security Analyst with a passion for creating secure and efficient web applications. I have been recognized as a top performer in the web development course by Internshala and have extensive experience working with Google Cloud, earning several badges. Additionally, I have acquired multiple certifications in cybersecurity from Coursera, provided by Google Cybersecurity Professional Certificates.</p>
          
          <h3>My Approach</h3>
          <p>I combine my expertise in full-stack development with a security-first mindset to build applications that are not only functional and user-friendly but also secure and resilient against threats. My background in both development and security gives me a unique perspective on creating robust web solutions.</p>
          
          <a href="/images/Soham_Mukherjee_Resume (3).pdf" class="btn" download="Soham_Mukherjee_Resume.pdf">Download Resume</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default {
  name: 'AboutSection',
  setup() {
    const sectionHeader = ref(null);
    const aboutImage = ref(null);
    const aboutText = ref(null);
    
    onMounted(() => {
      // Register ScrollTrigger if not registered already
      if (!ScrollTrigger.isRegistered) {
        gsap.registerPlugin(ScrollTrigger);
      }
      
      // Create animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
      
      // Add animations to timeline
      tl.from(aboutImage.value, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      .from(aboutText.value.querySelectorAll('h3, p'), {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .from(aboutText.value.querySelector('.btn'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, '-=0.2');
    });
    
    return {
      sectionHeader,
      aboutImage,
      aboutText
    };
  }
}
