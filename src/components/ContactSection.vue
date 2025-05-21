<template>
  <section id="contact" class="section">
    <div class="container">
      <div class="section-header" ref="sectionHeader">
        <h2>Get In Touch</h2>
        <p>Feel free to contact me for any opportunities or questions</p>
      </div>
      
      <div class="contact-container">
        <!-- Contact Information -->
        <div class="contact-info" ref="contactInfo">
          <a 
            href="mailto:sohamaxpauli@gmail.com" 
            class="contact-item" 
            aria-label="Send email to sohamaxpauli@gmail.com"
            ref="contactItems"
          >
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Email Me</h3>
              <p>sohamaxpauli@gmail.com</p>
            </div>
          </a>
          
          <a 
            href="tel:+919065349149" 
            class="contact-item" 
            aria-label="Call +91 9065349149"
            ref="contactItems"
          >
            <i class="fas fa-phone"></i>
            <div>
              <h3>Call Me</h3>
              <p>+91 9065349149</p>
            </div>
          </a>
          
          <a 
            href="https://maps.google.com/?q=Ranchi,Jharkhand,India" 
            target="_blank" 
            class="contact-item" 
            aria-label="View location on map: Ranchi, Jharkhand, India"
            ref="contactItems"
          >
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Find Me</h3>
              <p>Ranchi, Jharkhand, India</p>
            </div>
          </a>
          
          <div class="social-links" ref="socialLinks">
            <a 
              href="https://github.com/Asterioxer" 
              class="social-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Profile"
            >
              <i class="fab fa-github"></i>
              <span class="sr-only">GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/soham-mukherjee-40002b283/" 
              class="social-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
            >
              <i class="fab fa-linkedin"></i>
              <span class="sr-only">LinkedIn</span>
            </a>
            
            <a 
              href="https://x.com/frilovia" 
              class="social-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter Profile"
            >
              <i class="fab fa-twitter"></i>
              <span class="sr-only">Twitter</span>
            </a>
          </div>
        </div>
        
        <!-- Contact Form -->
        <div class="contact-form" ref="contactForm">
          <form id="contact-form" @submit.prevent="submitForm">
            <div class="form-group floating-label" :class="{ 'error': errors.name }">
              <div class="input-icon-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  v-model="formData.name"
                  placeholder=" " 
                  required
                  @input="clearError('name')"
                  :disabled="formState !== 'ready'"
                >
                <label for="name">Your Name</label>
                <span class="focus-border"></span>
              </div>
              <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
            </div>
            
            <div class="form-group floating-label" :class="{ 'error': errors.email }">
              <div class="input-icon-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  v-model="formData.email"
                  placeholder=" " 
                  required
                  @input="clearError('email')"
                  :disabled="formState !== 'ready'"
                >
                <label for="email">Your Email</label>
                <span class="focus-border"></span>
              </div>
              <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
            </div>
            
            <div class="form-group floating-label" :class="{ 'error': errors.subject }">
              <div class="input-icon-wrapper">
                <i class="fas fa-tag input-icon"></i>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  v-model="formData.subject"
                  placeholder=" " 
                  required
                  @input="clearError('subject')"
                  :disabled="formState !== 'ready'"
                >
                <label for="subject">Subject</label>
                <span class="focus-border"></span>
              </div>
              <div class="error-message" v-if="errors.subject">{{ errors.subject }}</div>
            </div>
            
            <div class="form-group floating-label" :class="{ 'error': errors.message }">
              <div class="input-icon-wrapper">
                <i class="fas fa-comment-alt input-icon"></i>
                <textarea 
                  id="message" 
                  name="message" 
                  v-model="formData.message"
                  rows="5" 
                  placeholder=" " 
                  required
                  @input="clearError('message')"
                  :disabled="formState !== 'ready'"
                ></textarea>
                <label for="message">Your Message</label>
                <span class="focus-border"></span>
              </div>
              <div class="error-message" v-if="errors.message">{{ errors.message }}</div>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-block btn-submit"
              :class="{ 'loading': formState === 'submitting' }"
              :disabled="formState !== 'ready'"
            >
              <span class="btn-text">Send Message</span>
              <span class="btn-loading"><i class="fas fa-circle-notch fa-spin"></i></span>
            </button>
          </form>
          
          <!-- Success Message -->
          <div class="success-message" v-if="formState === 'success'" ref="successMessage">
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message! I'll get back to you soon.</p>
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
  name: 'ContactSection',
  setup() {
    // References to DOM elements
    const sectionHeader = ref(null);
    const contactInfo = ref(null);
    const contactItems = ref([]);
    const socialLinks = ref(null);
    const contactForm = ref(null);
    const successMessage = ref(null);
    
    // Form data
    const formData = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Form validation errors
    const errors = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Form state: 'ready', 'submitting', 'success', 'error'
    const formState = ref('ready');
    
    // Clear specific error
    function clearError(field) {
      errors[field] = '';
    }
    
    // Validate email format
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Validate form before submission
    function validateForm() {
      let isValid = true;
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '');
      
      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Please enter your name';
        isValid = false;
      }
      
      // Email validation
      if (!formData.email.trim()) {
        errors.email = 'Please enter your email address';
        isValid = false;
      } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Subject validation
      if (!formData.subject.trim()) {
        errors.subject = 'Please enter a subject';
        isValid = false;
      }
      
      // Message validation
      if (!formData.message.trim()) {
        errors.message = 'Please enter your message';
        isValid = false;
      }
      
      return isValid;
    }
    
    // Handle form submission
    async function submitForm() {
      // Validate form first
      if (!validateForm()) {
        // Show error animation for invalid fields
        const errorFields = document.querySelectorAll('.form-group.error');
        
        gsap.fromTo(
          errorFields,
          { x: -5 },
          { 
            x: 0, 
            duration: 0.3, 
            ease: 'elastic.out(1, 0.3)',
            clearProps: 'x',
            stagger: 0.05
          }
        );
        
        return;
      }
      
      // Set form to submitting state
      formState.value = 'submitting';
      
      try {
        // Send form data to API
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message');
        }
        
        // Set success state
        formState.value = 'success';
        
        // Animate success message
        await nextTick();
        if (successMessage.value) {
          gsap.fromTo(
            successMessage.value, 
            { 
              scale: 0.8,
              opacity: 0
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.7)'
            }
          );
        }
        
        // Reset form data after delay
        setTimeout(() => {
          // Reset form
          Object.keys(formData).forEach(key => formData[key] = '');
          
          // Reset form state after success message has been shown
          setTimeout(() => {
            formState.value = 'ready';
          }, 5000);
        }, 1000);
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Set error state
        formState.value = 'error';
        
        // Show error message
        errors.submit = error.message || 'Failed to send message. Please try again later.';
        
        // Reset form state after error
        setTimeout(() => {
          formState.value = 'ready';
        }, 3000);
      }
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
      
      // Animate contact info items
      ScrollTrigger.create({
        trigger: contactInfo.value,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            contactItems.value,
            { 
              x: -30, 
              opacity: 0 
            },
            { 
              x: 0, 
              opacity: 1, 
              stagger: 0.1, 
              duration: 0.6, 
              ease: 'power2.out' 
            }
          );
          
          // Animate social links
          gsap.fromTo(
            socialLinks.value.querySelectorAll('.social-link'),
            { 
              y: 20, 
              opacity: 0 
            },
            { 
              y: 0, 
              opacity: 1, 
              stagger: 0.1, 
              duration: 0.5, 
              ease: 'back.out(1.7)',
              delay: 0.3
            }
          );
        }
      });
      
      // Animate contact form
      ScrollTrigger.create({
        trigger: contactForm.value,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          // Animate form inputs
          gsap.fromTo(
            contactForm.value.querySelectorAll('.form-group'),
            { 
              y: 30, 
              opacity: 0 
            },
            { 
              y: 0, 
              opacity: 1, 
              stagger: 0.1, 
              duration: 0.6, 
              ease: 'power2.out' 
            }
          );
          
          // Animate submit button
          gsap.fromTo(
            contactForm.value.querySelector('button'),
            { 
              y: 20, 
              opacity: 0 
            },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.6, 
              ease: 'back.out(1.5)',
              delay: 0.5
            }
          );
        }
      });
    });
    
    return {
      sectionHeader,
      contactInfo,
      contactItems,
      socialLinks,
      contactForm,
      successMessage,
      formData,
      errors,
      formState,
      clearError,
      submitForm
    };
  }
};
</script>

<style scoped>
/* Contact section styles */
.contact-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 3rem;
}

/* Contact info side */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--text-color);
}

.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 217, 255, 0.1);
  border-color: var(--primary-color);
}

.contact-item i {
  font-size: 2rem;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.contact-item:hover i {
  transform: scale(1.2);
}

.contact-item h3 {
  margin: 0 0 0.2rem;
  font-size: 1.1rem;
}

.contact-item p {
  margin: 0;
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-dark-color);
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid var(--glass-border);
}

.social-link:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: var(--dark-color);
  box-shadow: 0 10px 20px rgba(0, 217, 255, 0.3);
}

/* Contact form side */
.contact-form {
  background-color: var(--card-bg);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 217, 255, 0.1);
}

.form-group {
  margin-bottom: 2rem;
  position: relative;
}

.floating-label .input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.floating-label label {
  position: absolute;
  left: 3.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  pointer-events: none;
  transition: all 0.25s ease;
  padding: 0 5px;
  font-size: 1rem;
  background: transparent;
  z-index: 1;
}

.floating-label textarea ~ label {
  top: 1.2rem;
  transform: none;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem 1rem 1rem 3.2rem;
  background-color: var(--light-dark-color);
  color: var(--text-color);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  font-family: var(--body-font);
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
  padding-top: 1.5rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group input:not(:placeholder-shown),
.form-group textarea:not(:placeholder-shown) {
  outline: none;
  border-color: var(--primary-color);
  background-color: rgba(30, 30, 30, 0.9);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.15);
}

.floating-label input:focus ~ label,
.floating-label textarea:focus ~ label,
.floating-label input:not(:placeholder-shown) ~ label,
.floating-label textarea:not(:placeholder-shown) ~ label {
  top: -12px;
  left: 2.5rem;
  font-size: 0.8rem;
  color: var(--primary-color);
  background-color: var(--light-dark-color);
  padding: 0 8px;
  transition: 0.3s;
}

.floating-label textarea:focus ~ label,
.floating-label textarea:not(:placeholder-shown) ~ label {
  top: -12px;
  left: 2.5rem;
}

.focus-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease, left 0.3s ease;
}

.form-group input:focus ~ .focus-border,
.form-group textarea:focus ~ .focus-border {
  width: calc(100% - 2px);
  left: 1px;
}

/* Input icons */
.input-icon {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 1;
}

.floating-label textarea ~ .input-icon {
  top: 1.5rem;
  transform: none;
}

.form-group:hover .input-icon,
.form-group input:focus ~ .input-icon-wrapper .input-icon,
.form-group textarea:focus ~ .input-icon-wrapper .input-icon,
.form-group input:not(:placeholder-shown) ~ .input-icon-wrapper .input-icon,
.form-group textarea:not(:placeholder-shown) ~ .input-icon-wrapper .input-icon {
  color: var(--primary-color);
}

/* Error states */
.form-group.error input,
.form-group.error textarea {
  border-color: #ff3860;
  box-shadow: 0 0 0 3px rgba(255, 56, 96, 0.1);
}

.form-group.error .input-icon {
  color: #ff3860;
}

.error-message {
  color: #ff3860;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0.4rem 0.7rem;
  border-radius: var(--border-radius);
  background-color: rgba(255, 56, 96, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
  animation: fadeInError 0.3s forwards;
}

.error-message::before {
  content: "\f071";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

@keyframes fadeInError {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success message */
.success-message {
  background-color: rgba(0, 230, 118, 0.1);
  border: 1px solid var(--success-color);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 230, 118, 0.1);
  animation: successPulse 2s infinite;
}

@keyframes successPulse {
  0% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 230, 118, 0.1);
  }
  50% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 230, 118, 0.3);
  }
  100% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 230, 118, 0.1);
  }
}

.success-message i {
  color: var(--success-color);
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: successRotate 2s ease-in-out infinite;
}

@keyframes successRotate {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
}

.success-message p {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
}

/* Submit button with loading state */
.btn-submit {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 217, 255, 0.2);
}

.btn-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.btn-loading i {
  font-size: 1.2rem;
}

.btn-submit.loading .btn-loading {
  opacity: 1;
  visibility: visible;
}

.btn-submit.loading .btn-text {
  opacity: 0;
}

.btn-submit:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-info {
    order: 2; /* Move contact info below form on mobile */
  }
  
  .contact-form {
    order: 1; /* Move form above contact info on mobile */
    padding: 1.5rem;
  }
  
  .contact-item {
    padding: 1.2rem;
  }
  
  .contact-item i {
    font-size: 1.5rem;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 0.8rem 0.8rem 0.8rem 2.8rem;
    font-size: 0.95rem;
  }
  
  .input-icon {
    left: 1rem;
    font-size: 0.9rem;
  }
  
  .floating-label label {
    left: 2.8rem;
    font-size: 0.95rem;
  }
  
  .floating-label input:focus ~ label,
  .floating-label textarea:focus ~ label,
  .floating-label input:not(:placeholder-shown) ~ label,
  .floating-label textarea:not(:placeholder-shown) ~ label {
    left: 2.2rem;
    font-size: 0.75rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .contact-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .contact-form {
    padding: 2rem;
  }
}
</style>
