const parallaxItems = document.querySelectorAll("[data-speed]");
const revealItems = document.querySelectorAll(".reveal");

function updateParallax() {
  const scrollY = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.1);
    const movement = scrollY * speed;

    item.style.transform = `translate3d(0, ${movement}px, 0)`;
  });

  requestAnimationFrame(updateParallax);
}

requestAnimationFrame(updateParallax);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});