// Mobile Menu Functionality
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

// Toggle mobile menu
function toggleMobileMenu() {
  console.log("Toggling mobile menu");
  mobileMenu.classList.toggle("active");

  // Animate hamburger menu
  const spans = mobileMenuToggle.querySelectorAll("span");
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

// Close mobile menu
function closeMobileMenu() {
  console.log("Closing mobile menu");
  mobileMenu.classList.remove("active");

  // Reset hamburger menu
  const spans = mobileMenuToggle.querySelectorAll("span");
  spans[0].style.transform = "none";
  spans[1].style.opacity = "1";
  spans[2].style.transform = "none";
}

// Event listeners for mobile menu
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}

// Close mobile menu when clicking a link
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});
document.addEventListener("DOMContentLoaded", () => {
  const submenuToggle = document.querySelector(".submenu-toggle");
  const mobileSubmenu = document.querySelector(".mobile-submenu");

  submenuToggle.addEventListener("click", () => {
    mobileSubmenu.classList.toggle("open");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    mobileMenu.classList.contains("active") &&
    !mobileMenu.contains(e.target) &&
    !mobileMenuToggle.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Prevent accidental close when clicking inside menu
mobileMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});
