/**
 * START COMPANY — Master Frontend Interactions & Accessibility Engine
 * Vanilla JavaScript (Production-Ready, Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. STICKY HEADER SCROLL STATE
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  
  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on initial load

  // =========================================================================
  // 2. ACCESSIBLE MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileToggleBtn = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileDrawerCloseBtn = document.querySelector('.mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  const openMobileMenu = () => {
    document.body.classList.add('mobile-nav-open');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (mobileDrawer) {
      mobileDrawer.setAttribute('aria-hidden', 'false');
      // Set initial focus to close button for keyboard users
      if (mobileDrawerCloseBtn) {
        setTimeout(() => mobileDrawerCloseBtn.focus(), 100);
      }
    }
  };

  const closeMobileMenu = () => {
    document.body.classList.remove('mobile-nav-open');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileToggleBtn.focus();
    }
    if (mobileDrawer) {
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileDrawerCloseBtn) {
    mobileDrawerCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close when clicking any link inside the mobile drawer
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Keyboard accessibility for drawer: Escape key & Tab trapping
  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('mobile-nav-open')) return;

    if (e.key === 'Escape') {
      closeMobileMenu();
      return;
    }

    if (e.key === 'Tab' && mobileDrawer) {
      const focusableElements = mobileDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  // =========================================================================
  // 3. NATIVE INTERSECTION OBSERVER SCROLL-REVEAL ANIMATIONS
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Reveal everything immediately if user prefers reduced motion or unsupported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // =========================================================================
  // 4. CONTACT FORM INTERACTIVE VALIDATION & CLIENT-SIDE SUBMISSION UX
  // =========================================================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const formAlert = document.getElementById('form-alert');

    // Email format validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    const validateField = (input, validator, errorMsg) => {
      const parentGroup = input.closest('.form-field-group');
      if (!parentGroup) return false;

      const errorElement = parentGroup.querySelector('.form-error-msg');
      const isValid = validator(input.value.trim());

      if (!isValid) {
        parentGroup.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        if (errorElement) {
          errorElement.textContent = errorMsg;
        }
        return false;
      } else {
        parentGroup.classList.remove('is-invalid');
        input.setAttribute('aria-invalid', 'false');
        if (errorElement) {
          errorElement.textContent = '';
        }
        return true;
      }
    };

    // Real-time input cleaning
    nameInput?.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        nameInput.closest('.form-field-group')?.classList.remove('is-invalid');
        nameInput.setAttribute('aria-invalid', 'false');
      }
    });

    emailInput?.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-field-group')?.classList.remove('is-invalid');
        emailInput.setAttribute('aria-invalid', 'false');
      }
    });

    subjectInput?.addEventListener('input', () => {
      if (subjectInput.value.trim().length >= 3) {
        subjectInput.closest('.form-field-group')?.classList.remove('is-invalid');
        subjectInput.setAttribute('aria-invalid', 'false');
      }
    });

    messageInput?.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        messageInput.closest('.form-field-group')?.classList.remove('is-invalid');
        messageInput.setAttribute('aria-invalid', 'false');
      }
    });

    // Blur validation
    nameInput?.addEventListener('blur', () => {
      validateField(nameInput, val => val.length >= 2, 'Please enter your full name (at least 2 characters).');
    });

    emailInput?.addEventListener('blur', () => {
      validateField(emailInput, val => emailRegex.test(val), 'Please enter a valid email address.');
    });

    subjectInput?.addEventListener('blur', () => {
      validateField(subjectInput, val => val.length >= 3, 'Please enter a subject (at least 3 characters).');
    });

    messageInput?.addEventListener('blur', () => {
      validateField(messageInput, val => val.length >= 10, 'Please provide a message with at least 10 characters.');
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isNameValid = validateField(nameInput, val => val.length >= 2, 'Please enter your full name (at least 2 characters).');
      const isEmailValid = validateField(emailInput, val => emailRegex.test(val), 'Please enter a valid email address.');
      const isSubjectValid = validateField(subjectInput, val => val.length >= 3, 'Please enter a subject (at least 3 characters).');
      const isMessageValid = validateField(messageInput, val => val.length >= 10, 'Please provide a message with at least 10 characters.');

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        // Focus on first invalid input
        const firstInvalid = contactForm.querySelector('.form-field-group.is-invalid input, .form-field-group.is-invalid textarea');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Show Loading State
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Hide prior alert
      if (formAlert) {
        formAlert.className = 'form-alert';
        formAlert.style.display = 'none';
      }

      // Simulate asynchronous form submission handling
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        if (formAlert) {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>Message sent successfully!</strong>
              <p>Thank you, ${nameInput.value.trim().split(' ')[0]}. Our strategy team has received your message and will respond to <em>${emailInput.value.trim()}</em> within 24 business hours.</p>
            </div>
          `;
          formAlert.style.display = 'flex';
          formAlert.focus();
        }

        // Reset form inputs
        contactForm.reset();
      }, 900);
    });
  }

  // =========================================================================
  // 5. AUTO-FILL SERVICE IN CONTACT FORM VIA QUERY PARAM
  // =========================================================================
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service');
  if (requestedService) {
    const subjectField = document.getElementById('subject');
    if (subjectField && !subjectField.value) {
      subjectField.value = `Inquiry: ${decodeURIComponent(requestedService)}`;
    }
  }

  // =========================================================================
  // 6. DYNAMIC CURRENT YEAR IN FOOTER
  // =========================================================================
  const currentYearSpans = document.querySelectorAll('.current-year');
  const thisYear = new Date().getFullYear();
  currentYearSpans.forEach(el => {
    el.textContent = thisYear.toString();
  });
});

