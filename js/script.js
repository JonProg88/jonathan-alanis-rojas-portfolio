/* ============================= */
/* FULLSCREEN SVG MENU */
/* ============================= */

const menuToggle = document.querySelector(".menu-toggle");
const fullscreenMenu = document.querySelector(".fullscreen-menu");
const menuShape = document.querySelector(".menu-shape");
const menuLinks = document.querySelector(".menu-links");
const menuLinkItems = document.querySelectorAll(".menu-links a");

let menuOpen = false;

const closedPath = "M0 0 H100 V0 Q50 0 0 0 Z";
const openPath = "M0 0 H100 V100 Q50 100 0 100 Z";


function openMenu() {
  menuOpen = true;

  menuToggle.classList.add("is-open");
  fullscreenMenu.classList.add("is-open");

  gsap.set(menuLinks, {
    autoAlpha: 1,
  });

  gsap.set(menuLinkItems, {
    y: 100,
    opacity: 0,
    scale: 0.8,
    rotation: 2,
    transformOrigin: "center center",
  });

  gsap.timeline()
    .to(menuShape, {
      attr: { d: openPath },
      duration: 1,
      ease: "power4.inOut",
    })
    .to(
      menuLinkItems,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "elastic.out(1, 0.65)",
      },
      "-=0.35"
    );
}

function closeMenu() {
  menuOpen = false;

  menuToggle.classList.remove("is-open");

  gsap.timeline({
    onComplete() {
      fullscreenMenu.classList.remove("is-open");

      gsap.set(menuLinks, {
        autoAlpha: 0,
      });

      gsap.set(menuLinkItems, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotation: 2,
      });
    },
  })
    .to(menuLinkItems, {
      y: -30,
      opacity: 0,
      scale: 0.9,
      duration: 0.35,
      stagger: 0.04,
      ease: "power2.in",
    })
    .to(
      menuShape,
      {
        attr: { d: closedPath },
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.1"
    );
}








// function openMenu() {
//   menuOpen = true;

//   menuToggle.classList.add("is-open");
//   fullscreenMenu.classList.add("is-open");

//   gsap.set(menuLinks, {
//     autoAlpha: 1,
//   });

//   gsap.timeline()
//     .to(menuShape, {
//       attr: { d: openPath },
//       duration: 1,
//       ease: "power4.inOut",
//     })
//     .to(
//       menuLinkItems,
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         stagger: 0.08,
//         ease: "power3.out",
//       },
//       "-=0.4"
//     );
// }

// function closeMenu() {
//   menuOpen = false;

//   menuToggle.classList.remove("is-open");

//   gsap.timeline({
//     onComplete() {
//       fullscreenMenu.classList.remove("is-open");

//       gsap.set(menuLinks, {
//         autoAlpha: 0,
//       });

//       gsap.set(menuLinkItems, {
//         y: 40,
//         opacity: 0,
//       });
//     },
//   })
//     .to(menuLinkItems, {
//       y: -40,
//       opacity: 0,
//       duration: 0.45,
//       stagger: 0.05,
//       ease: "power2.in",
//     })
//     .to(
//       menuShape,
//       {
//         attr: { d: closedPath },
//         duration: 1,
//         ease: "power4.inOut",
//       },
//       "-=0.2"
//     );
// }

menuToggle.addEventListener("click", function () {
  if (menuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuLinkItems.forEach(function (link) {
  link.addEventListener("click", function () {
    closeMenu();
  });
});

/* ============================= */
/* SMUDGE REVEAL HERO */
/* ============================= */

const config = {
  smoothing: 0.1,
  movementThreshold: 0.01,
  sizeFromSpeed: 0.2,
  expandMultiplier: 2,
  expandTime: 2,
  expandEase: "power1.inOut",
  dissolveStart: 2,
  dissolveTime: 3,
  dissolveEase: "power3.in",
};

const heroSection = document.querySelector(".hero");
const smudgeSVG = document.querySelector(".smudge-revealer");
const smudgeContainer = document.querySelector(".smudge-blobs");

const pointer = { x: 0, y: 0 };
const smoothPointer = { x: 0, y: 0 };

let hasStarted = false;

function onPointerMove(x, y) {
  if (!hasStarted) {
    pointer.x = smoothPointer.x = x;
    pointer.y = smoothPointer.y = y;
    hasStarted = true;
    return;
  }

  pointer.x = x;
  pointer.y = y;
}

heroSection.addEventListener("mousemove", function (e) {
  onPointerMove(e.pageX, e.pageY);
});

heroSection.addEventListener(
  "touchstart",
  function (e) {
    e.preventDefault();
    onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
  },
  { passive: false }
);

heroSection.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
    onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
  },
  { passive: false }
);

function matchSVGToViewport() {
  smudgeSVG.style.width = window.innerWidth + "px";
  smudgeSVG.style.height = window.innerHeight + "px";
}

matchSVGToViewport();

window.addEventListener("resize", matchSVGToViewport);

function stampSmudgeAt(x, y, radius) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", "#fff");

  smudgeContainer.prepend(circle);

  const animatedRadius = { current: radius };

  const timeline = gsap.timeline({
    onUpdate() {
      circle.setAttribute("r", Math.max(0, animatedRadius.current));
    },
    onComplete() {
      timeline.kill();
      circle.remove();
    },
  });

  timeline.to(animatedRadius, {
    current: radius * config.expandMultiplier,
    duration: config.expandTime,
    ease: config.expandEase,
  });

  timeline.to(
    animatedRadius,
    {
      current: 0,
      duration: config.dissolveTime,
      ease: config.dissolveEase,
    },
    config.dissolveStart
  );
}

function update() {
  if (hasStarted) {
    smoothPointer.x += (pointer.x - smoothPointer.x) * config.smoothing;
    smoothPointer.y += (pointer.y - smoothPointer.y) * config.smoothing;

    const speed = Math.hypot(
      pointer.x - smoothPointer.x,
      pointer.y - smoothPointer.y
    );

    if (speed > config.movementThreshold) {
      stampSmudgeAt(
        smoothPointer.x,
        smoothPointer.y,
        speed * config.sizeFromSpeed
      );
    }
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);



/* ============================= */
/* HORIZONTAL PROJECTS PARALLAX */
/* ============================= */

/* ============================= */
/* HORIZONTAL PROJECTS PARALLAX */
/* ============================= */

gsap.registerPlugin(ScrollTrigger);

const projectsSection = document.querySelector(".projects-horizontal");
const projectsSticky = document.querySelector(".projects-sticky");
const projectsTrack = document.querySelector(".projects-track");
const projectPanels = gsap.utils.toArray(".project-panel");

if (projectsSection && projectsSticky && projectsTrack && window.innerWidth > 768) {
  const getScrollDistance = () => {
    return projectsTrack.scrollWidth - window.innerWidth;
  };

  const setProjectsHeight = () => {
    const scrollDistance = getScrollDistance();
    projectsSection.style.height = `${scrollDistance + window.innerHeight}px`;
  };

  setProjectsHeight();

  gsap.to(projectsTrack, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: projectsSection,
      start: "top top",
      end: () => `+=${getScrollDistance()}`,
      scrub: 1,
      pin: projectsSticky,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  projectPanels.forEach((panel, index) => {
    gsap.to(panel, {
      y: index % 2 === 0 ? -80 : 80,
      rotate: index % 2 === 0 ? 4 : -4,
      ease: "none",
      scrollTrigger: {
        trigger: projectsSection,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
      },
    });
  });

  window.addEventListener("resize", () => {
    setProjectsHeight();
    ScrollTrigger.refresh();
  });
}




// gsap.registerPlugin(ScrollTrigger);

// const projectsSection = document.querySelector(".projects-horizontal");
// const projectsTrack = document.querySelector(".projects-track");
// const projectPanels = gsap.utils.toArray(".project-panel");

// if (projectsSection && projectsTrack && window.innerWidth > 768) {
//   const getScrollAmount = () => {
//     return -(projectsTrack.scrollWidth - window.innerWidth);
//   };

//   gsap.to(projectsTrack, {
//     x: getScrollAmount,
//     ease: "none",
//     scrollTrigger: {
//       trigger: projectsSection,
//       start: "top top",
//       end: () => `+=${projectsTrack.scrollWidth}`,
//       scrub: 1,
//       pin: ".projects-sticky",
//       invalidateOnRefresh: true,
//     },
//   });

//   projectPanels.forEach((panel, index) => {
//     gsap.to(panel, {
//       y: index % 2 === 0 ? -80 : 80,
//       rotate: index % 2 === 0 ? 4 : -4,
//       ease: "none",
//       scrollTrigger: {
//         trigger: projectsSection,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 1,
//       },
//     });
//   });
// }
