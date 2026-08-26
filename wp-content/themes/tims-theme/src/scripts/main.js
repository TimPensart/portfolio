import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Lenis from "lenis";

import Render3dPhone from "./phone3d";

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

    // The grid is two columns, so cards enter diagonally: the column index sets
    // the base delay and the row nudges it along. Math.max keeps the modulo
    // divisor at 1 or more -- with one or two cards it would otherwise be 0,
    // and every delay would come out NaN.
    const rowCount = Math.max(Math.floor(gridItems.length / 2), 1);

    gridItems.forEach((item, index) => {
        const diagonalIndex = (index % rowCount) + (index / gridItems.length) * 2;

        gsap.from(item, {
            scrollTrigger: {
                trigger: ".wp-block-tim-projects-grid",
                start: "top 80%",
                once: true,
            },
            delay: diagonalIndex * 0.2,
            duration: 0.8,
            ease: "power3.out",
            y: 100,
            opacity: 0,
        });
    });
}

function render3dScenes() {
    document.querySelectorAll(".three-container[data-model]").forEach((element) => {
        Render3dPhone(element, element.dataset.model);
    });
}
