import swiper from "swiper";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css/bundle";

const swipers = function () {
    console.log("Initializing swipers...");
    const projectSwiper = new swiper(".swiper-projects", {
        modules: [Navigation, Keyboard],
        slidesPerView: 3,
        spaceBetween: 48,
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 50,
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            nextEl: ".projects-next",
            prevEl: ".projects-prev",
        },
    });
};

export default swipers;
