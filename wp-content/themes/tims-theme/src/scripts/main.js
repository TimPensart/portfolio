import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", function () {
    const lenis = new Lenis();

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on("scroll", ScrollTrigger.update);

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    textRevealAnimation();

    gridStaggerAnimation();
});

function textRevealAnimation() {
    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    let allHeadings = document.querySelectorAll(".wp-block-heading");

    let splitHeadings = SplitText.create(allHeadings, {
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
    });
}

function gridStaggerAnimation() {
    let gridItems = document.querySelectorAll(".wp-block-tim-projects-grid > a");

    gridItems.forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
            },
            duration: 0.8,
            ease: "power3.out",
            y: 100,
            opacity: 0,
        });
    });
}
