import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Lenis from "lenis";

// Visitors who ask for reduced motion get the page without the reveals, the
// smooth-scroll hijack or the 3D scenes -- all three are decoration.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    if (prefersReducedMotion) return;

    const lenis = new Lenis();

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    textRevealAnimation();

    gridStaggerAnimation();

    render3dScenes();
});

function textRevealAnimation() {
    const allHeadings = document.querySelectorAll(".wp-block-heading");

    if (allHeadings.length === 0) return;

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    const splitHeadings = SplitText.create(allHeadings, {
        type: "lines, words",
        mask: "lines",
    });

    ScrollTrigger.batch(splitHeadings.words, {
        onEnter: (batch) => {
            gsap.from(batch, {
                duration: 1,
                ease: "power4.out",
                stagger: 0.16,
                y: 64,
                filter: "blur(8px)",
                opacity: 0,
            });
        },
        once: true,
    });
}

function gridStaggerAnimation() {
    const gridItems = document.querySelectorAll(".wp-block-tim-projects-grid > a");

    if (gridItems.length === 0) return;

    gridItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: ".wp-block-tim-projects-grid",
                start: "top 80%",
                once: true,
            },
            delay: index * 0.1,
            duration: 0.8,
            ease: "power3.out",
            y: 100,
            opacity: 0,
        });
    });
}

// three.js and its loaders are by far the heaviest thing the site ships, and a
// static `import` of them would be part of this module's graph -- which the
// browser has to finish fetching and evaluating before it fires `load`. p5 runs
// in global mode and starts on `load`, so a static import meant the hero sketch
// sat there waiting on a bundle for a scene several screens further down.
//
// Importing on demand takes it out of that graph entirely: the hero paints as
// soon as its own script is ready, and the 3D bundle plus the .glb are only
// fetched once a scene is close enough to matter.
let phone3dModule = null;

function loadPhone3d() {
    if (phone3dModule === null) {
        phone3dModule = import("./phone3d.js");
    }

    return phone3dModule;
}

function render3dScenes() {
    document.querySelectorAll(".three-container[data-model]").forEach((element) => {
        // One observer per scene so each one disconnects itself the moment it
        // has triggered. The margin gives the download a head start of two
        // viewports, so the phone is usually there by the time it scrolls in.
        const observer = new IntersectionObserver(
            (entries, self) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;

                self.disconnect();

                loadPhone3d()
                    .then(({ default: Render3dPhone }) => Render3dPhone(element, element.dataset.model))
                    .catch((error) => console.error("Could not load the 3D scene bundle", error));
            },
            { rootMargin: "200% 0px" }
        );

        observer.observe(element);
    });
}
