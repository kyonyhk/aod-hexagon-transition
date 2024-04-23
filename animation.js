import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', function() {
    const gsap = window.gsap; // Ensure GSAP is loaded correctly
    gsap.to("g", {
        duration: 2, // Duration of the animation
        scale: 1.5, // Scale up the group
        repeat: -1, // Infinite repeat
        yoyo: true, // Go back and forth
        ease: "power2.inOut" // Easing function for a smoother effect
    });
});
