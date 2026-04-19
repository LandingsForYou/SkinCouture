const body = document.body;

/* nav */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navToggle.classList.toggle("is-active");
    siteNav.classList.toggle("is-open");
    body.classList.toggle("menu-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      body.classList.remove("menu-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
/* modal */
const modalBackdrop = document.getElementById("modal-backdrop");
const modalButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".procedure-modal");
const modalCloseButtons = document.querySelectorAll(".procedure-modal__close");

function closeAllModals() {
  modals.forEach((modal) => modal.classList.remove("is-active"));
  if (modalBackdrop) modalBackdrop.classList.remove("is-active");
  body.classList.remove("menu-open");
}

function openModal(id) {
  const targetModal = document.getElementById(id);
  if (!targetModal) return;

  modals.forEach((modal) => modal.classList.remove("is-active"));
  targetModal.classList.add("is-active");
  if (modalBackdrop) modalBackdrop.classList.add("is-active");
  body.classList.add("menu-open");
}

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modal);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAllModals);
});

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeAllModals);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

/* mobile slider dots */
const proceduresGrid = document.querySelector(".procedures-grid");
const proceduresDots = document.querySelector(".procedures-dots");

let proceduresScrollHandler = null;

function initProcedureDots() {
  if (!proceduresGrid || !proceduresDots) return;

  proceduresDots.innerHTML = "";

  if (proceduresScrollHandler) {
    proceduresGrid.removeEventListener("scroll", proceduresScrollHandler);
    proceduresScrollHandler = null;
  }

  if (window.innerWidth > 600) return;

  const cards = [...proceduresGrid.querySelectorAll(".procedure-card")];

  cards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";

    if (index === 0) dot.classList.add("is-active");

    dot.addEventListener("click", () => {
      proceduresGrid.scrollTo({
        left: card.offsetLeft - 8,
        behavior: "smooth",
      });
    });

    proceduresDots.appendChild(dot);
  });

  const dots = [...proceduresDots.querySelectorAll("button")];

  proceduresScrollHandler = () => {
    const gridLeft = proceduresGrid.getBoundingClientRect().left;
    let activeIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(
        card.getBoundingClientRect().left - gridLeft - 8,
      );

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  proceduresGrid.addEventListener("scroll", proceduresScrollHandler, {
    passive: true,
  });

  proceduresScrollHandler();
}

window.addEventListener("load", initProcedureDots);
window.addEventListener("resize", initProcedureDots);

/* reviews slider */
const reviewsTrack = document.querySelector(".reviews-track");
const reviewCards = document.querySelectorAll(".review-card");
const reviewsDots = document.querySelector(".reviews-dots");
const reviewsPrev = document.querySelector(".reviews-arrow--prev");
const reviewsNext = document.querySelector(".reviews-arrow--next");

let reviewsIndex = 0;

function getReviewsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1100) return 2;
  return 3;
}

function buildReviewsDots() {
  if (!reviewsDots || !reviewCards.length) return;

  const perView = getReviewsPerView();
  const pages = Math.max(1, Math.ceil(reviewCards.length / perView));

  reviewsDots.innerHTML = "";

  for (let i = 0; i < pages; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";

    if (i === reviewsIndex) {
      dot.classList.add("is-active");
    }

    dot.addEventListener("click", () => {
      reviewsIndex = i;
      updateReviewsSlider();
    });

    reviewsDots.appendChild(dot);
  }
}

function updateReviewsSlider() {
  if (!reviewsTrack || !reviewCards.length) return;

  const perView = getReviewsPerView();
  const pages = Math.max(1, Math.ceil(reviewCards.length / perView));

  if (reviewsIndex > pages - 1) {
    reviewsIndex = pages - 1;
  }

  const dots = reviewsDots ? reviewsDots.querySelectorAll("button") : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === reviewsIndex);
  });

  if (window.innerWidth <= 600) {
    const targetCard = reviewCards[reviewsIndex];
    if (targetCard) {
      reviewsTrack.scrollTo({
        left: targetCard.offsetLeft - 8,
        behavior: "smooth",
      });
    }
    return;
  }

  const gap = window.innerWidth <= 1100 ? 24 : 24;
  const cardWidth = reviewCards[0].offsetWidth + gap;
  const offset = reviewsIndex * cardWidth * perView;
  reviewsTrack.style.transform = `translateX(-${offset}px)`;
}

if (reviewsPrev) {
  reviewsPrev.addEventListener("click", () => {
    const perView = getReviewsPerView();
    const pages = Math.max(1, Math.ceil(reviewCards.length / perView));
    reviewsIndex = reviewsIndex <= 0 ? pages - 1 : reviewsIndex - 1;
    updateReviewsSlider();
  });
}

if (reviewsNext) {
  reviewsNext.addEventListener("click", () => {
    const perView = getReviewsPerView();
    const pages = Math.max(1, Math.ceil(reviewCards.length / perView));
    reviewsIndex = reviewsIndex >= pages - 1 ? 0 : reviewsIndex + 1;
    updateReviewsSlider();
  });
}

if (window.innerWidth <= 600 && reviewsTrack) {
  reviewsTrack.addEventListener(
    "scroll",
    () => {
      const cards = [...reviewCards];
      const trackLeft = reviewsTrack.getBoundingClientRect().left;
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - trackLeft - 12,
        );
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      reviewsIndex = activeIndex;

      const dots = reviewsDots ? reviewsDots.querySelectorAll("button") : [];
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === reviewsIndex);
      });
    },
    { passive: true },
  );
}

window.addEventListener("load", () => {
  buildReviewsDots();
  updateReviewsSlider();
});

window.addEventListener("resize", () => {
  buildReviewsDots();
  updateReviewsSlider();
});

/* reveal animations */
const revealItems = document.querySelectorAll(
  ".hero-stage, .title, .about-grid, .procedure-feature, .procedures-slider, .results-grid, .reviews-slider, .reviews-controls, .contacts-shell",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal", "is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");

  if (index % 3 === 1) item.classList.add("reveal-delay-1");
  if (index % 3 === 2) item.classList.add("reveal-delay-2");

  revealObserver.observe(item);
});

const staggerItems = document.querySelectorAll(
  ".procedure-card, .review-card, .results-point, .about-point",
);

const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.children] : [entry.target];
        const index = siblings.indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 90);

        staggerObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -30px 0px",
  },
);

staggerItems.forEach((item) => {
  staggerObserver.observe(item);
});
