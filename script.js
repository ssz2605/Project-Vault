document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Functionality ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
  const submenuToggle = document.querySelector(".submenu-toggle");
  const mobileSubmenu = document.querySelector(".mobile-submenu");

  function toggleMobileMenu() {
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenu.classList.toggle("active");
    const spans = mobileMenuToggle.querySelectorAll("span");
    if (spans.length < 3) return;
    if (mobileMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenu.classList.remove("active");
    const spans = mobileMenuToggle.querySelectorAll("span");
    if (spans.length < 3) return;
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  if (mobileMenuLinks && mobileMenuLinks.length > 0) {
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  if (submenuToggle && mobileSubmenu) {
    submenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      mobileSubmenu.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      mobileMenu &&
      mobileMenuToggle &&
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const button = this.querySelector('button[type="submit"]');
      if (!button) return;
      const buttonText = button.querySelector(".button-text");
      const loading = button.querySelector(".loading");
      if (!buttonText || !loading) return;

      // Show loading state
      buttonText.style.display = "none";
      loading.style.display = "inline-block";
      button.disabled = true;

      // Simulate async submission
      setTimeout(() => {
        this.reset();
        buttonText.style.display = "inline";
        loading.style.display = "none";
        button.disabled = false;

        alert("Thank you for your message! We'll get back to you soon.");
      }, 2000);
    });
  }

  // --- Set Current Year ---
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Navbar Highlighting
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link, .mobile-menu-link, .footer-ul li a");
  if (navLinks && navLinks.length > 0) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.includes(currentPath)) {
        link.classList.add("active");
      }
      // Highlight dropdown 'Components' if any of its child pages is active
      const componentPages = ["website.html", "games.html", "ml.html"];
      const dropdownToggle = document.querySelector(".dropdown-toggle");
      if (componentPages.includes(currentPath) && dropdownToggle) {
        dropdownToggle.classList.add("active");
      }
    });
  }
});