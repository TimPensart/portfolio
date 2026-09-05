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

    // p5 runs in global mode, and p5 only starts a global sketch on `load`.
    // Anything that keeps the load event pending -- a dynamically imported
    // module chunk very much included -- keeps the hero sketch from starting,
    // which is why moving to `import()` alone was not enough. Waiting for
    // `load` before we even set the observers up takes the 3D bundle out of
    // that critical path entirely.
    if (document.readyState === "complete") {
        render3dScenes();
    } else {
        window.addEventListener("load", render3dScenes, { once: true });
    }
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

// three.js and its loaders are by far the heaviest thing the site ships. A
// static `import` would put them in this module's graph, which the browser has
// to finish before it fires `load`; a dynamic `import()` started before `load`
// keeps that event pending just the same. Both starve the hero sketch, so the
// call site above waits for `load` and the bundle plus the .glb are only
// fetched once a scene is actually close to the viewport.
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
