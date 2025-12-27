import './style.css'
import { init3DScene } from './bg-3d.js';

init3DScene();

// Terminal Animation
const terminalLines = [
  { text: "> Initializing environment...", type: "text", delay: 500 },
  { text: "> Loading modules: [Playwright, Python]", type: "text", delay: 800 },
  { text: "> Executing test suite 'Portfolio_Health_Check'...", type: "text", delay: 1500 },
  { text: "[PASS] Core Systems Operational", type: "success", delay: 2200 },
  { text: "[PASS] UI/UX Rendered Successfully", type: "success", delay: 2500 },
  { text: "[INFO] Automation efficiency at 99.9%", type: "info", delay: 3000 },
  { text: "> Deployment successful. Welcome to my Portfolio!", type: "text", delay: 3800 },
  { text: "_", type: "cursor", delay: 4000 }
];

const terminalOutput = document.getElementById('terminal-output');

function runTerminal() {
  if (!terminalOutput) return;
  terminalOutput.innerHTML = ''; // Reset

  let accumulatedDelay = 0;

  terminalLines.forEach(line => {
    accumulatedDelay += (Math.random() * 500) + 200; // Randomize slightly for realism

    setTimeout(() => {
      // Remove previous cursor if exists
      const oldCursor = terminalOutput.querySelector('.t-cursor');
      if (oldCursor) oldCursor.remove();

      const el = document.createElement('div');
      el.classList.add('t-line');

      if (line.type === 'success') {
        el.classList.add('t-success');
        el.innerHTML = `✓ ${line.text}`;
      } else if (line.type === 'info') {
        el.classList.add('t-info');
        el.innerHTML = `i ${line.text}`;
      } else if (line.type === 'error') {
        el.classList.add('t-error');
        el.innerHTML = `✗ ${line.text}`;
      } else if (line.type === 'cursor') {
        // Just the new cursor
        el.classList.add('t-cursor');
        el.innerHTML = '';
      } else {
        el.innerHTML = line.text;
      }

      terminalOutput.appendChild(el);

      // Auto scroll to bottom
      terminalOutput.scrollTop = terminalOutput.scrollHeight;

    }, accumulatedDelay);
  });
}

// Start terminal on load
window.addEventListener('load', runTerminal);

// Smooth Scroll for Nav Links (Optional if native scroll-behavior is not enough)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({
        top: target.offsetTop - navHeight, // Dynamic offset
        behavior: 'smooth'
      });
    }
  });
});

console.log('System Operational');

// Project Modal Logic
const modal = document.getElementById('project-modal');
const modalVideo = document.getElementById('modal-video');
const modalProjectTitle = document.getElementById('modal-project-title');
const modalDesc = document.getElementById('modal-project-desc');
const modalWindowTitle = document.querySelector('.modal-title');
const closeModalBtn = document.querySelector('.modal-close');
const modalImage = document.getElementById('modal-image');
const modalImageContainer = document.querySelector('.modal-image-container');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const imageCounter = document.querySelector('.image-counter');

let projectImages = [];
let currentImageIndex = 0;

function openModal(card) {
  const videoId = card.getAttribute('data-video-id');
  const description = card.getAttribute('data-description');
  const imagesAttr = card.getAttribute('data-images');
  projectImages = imagesAttr ? imagesAttr.split(',').filter(img => img.trim() !== '') : [];
  currentImageIndex = 0;

  // 1. Project Title (Content H3)
  const projectTitle = card.getAttribute('data-project-title') || card.querySelector('h5').innerText;

  // 2. Window Title (Top Bar)
  const defaultWindowTitle = projectTitle.replace(/\s+/g, '_') + '.exe';
  const windowTitle = card.getAttribute('data-window-title') || defaultWindowTitle;

  // Set Content
  const videoContainer = document.querySelector('.video-container');
  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modalVideo.src = embedUrl;
    videoContainer.style.display = 'block';
  } else {
    modalVideo.src = '';
    videoContainer.style.display = 'none';
  }

  modalProjectTitle.innerText = projectTitle;
  modalDesc.innerText = description;
  if (modalWindowTitle) modalWindowTitle.innerText = windowTitle;

  // Handle Image Carousel
  updateCarousel();

  // Show Modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restore scrolling

  // Stop Video & Clear Image State
  modalVideo.src = '';
  modalImage.src = '';
  projectImages = [];
  currentImageIndex = 0;
}

function updateCarousel() {
  if (projectImages.length > 0) {
    modalImage.src = projectImages[currentImageIndex];
    modalImageContainer.style.display = 'flex';

    // Show/Hide buttons
    if (projectImages.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      imageCounter.style.display = 'block';
      imageCounter.innerText = `${currentImageIndex + 1} / ${projectImages.length}`;
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      imageCounter.style.display = 'none';
    }
  } else {
    modalImage.src = '';
    modalImageContainer.style.display = 'none';
  }
}

function nextImage() {
  if (projectImages.length <= 1) return;
  currentImageIndex = (currentImageIndex + 1) % projectImages.length;
  updateCarousel();
}

function prevImage() {
  if (projectImages.length <= 1) return;
  currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
  updateCarousel();
}

// Event Listeners
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (prevBtn) prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  prevImage();
});

if (nextBtn) nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  nextImage();
});

// Close on outside click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('active')) closeModal();
    if (resumeModal.classList.contains('active')) closeResumeModal();
  }
});

// Resume Modal Logic
const resumeBtn = document.getElementById('resume-btn');
const resumeModal = document.getElementById('resume-modal');

function openResumeModal(e) {
  if (e) e.preventDefault();
  resumeModal.classList.add('active');
  resumeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  resumeModal.classList.remove('active');
  resumeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (resumeBtn) {
  resumeBtn.addEventListener('click', openResumeModal);
}

const resumeCloseBtn = resumeModal.querySelector('.modal-close');
if (resumeCloseBtn) {
  resumeCloseBtn.addEventListener('click', closeResumeModal);
}

// Close on outside click for resume modal
resumeModal.addEventListener('click', (e) => {
  if (e.target === resumeModal) {
    closeResumeModal();
  }
});

// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

document.querySelectorAll('section, .project-card, .about-card, .timeline-item').forEach(el => {
  el.classList.add('reveal-on-scroll');
  observer.observe(el);
});
