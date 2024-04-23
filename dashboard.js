import gsap from "gsap";

const dashboard = document.getElementById('dashboard');
const dashboardTrigger = document.querySelector('.dashboard-trigger');
const inputRows = document.querySelectorAll('.input-row');
const settingsButton = document.getElementById('applySettings');
const dashboardHeading = document.querySelector('.dashboard-heading');
let isOpen = true;  // Initial state of the dashboard

const dashboardPaddingTop = parseInt(window.getComputedStyle(dashboard).paddingTop, 10);
const dashboardPaddingBottom = parseInt(window.getComputedStyle(dashboard).paddingBottom, 10);
const headingHeight = dashboardHeading.offsetHeight;

console.log(headingHeight)
console.log(dashboardPaddingTop)
console.log(dashboardPaddingBottom)

dashboardTrigger.addEventListener('click', () => {
    if (isOpen) {
        // Close the dashboard
        const targetHeight = headingHeight + dashboardPaddingTop + dashboardPaddingBottom;
        const tl = gsap.timeline();
        tl.to(settingsButton, { 
            opacity: 0,
            height: 0,
            ease: "power4.out",
            onComplete: () => settingsButton.style.pointerEvents = 'none' // Disable interaction
        })
        .to([...inputRows].reverse(), { // Reverse to start with the last item
            opacity: 0,
            height: 0,
            ease: "power4.out",
            stagger: 0.1,
            onComplete: () => inputRows.forEach(row => row.style.pointerEvents = 'none') // Disable interaction
        })
        .to(dashboard, {
            height: targetHeight + 'px',
            duration: 0.5,
            ease: "power4.inOut"
        });
    } else {
        // Open the dashboard
        settingsButton.style.pointerEvents = 'auto'; // Enable interaction
        inputRows.forEach(row => row.style.pointerEvents = 'auto'); // Enable interaction for each input row

        gsap.timeline()
            .to(dashboard, {
                height: 'auto',
                duration: 0.5,
                ease: "power4.inOut"
            })
            .from(settingsButton, { 
                opacity: 0,
                height: 0,
                ease: "power4.out",
                delay: 0.5
            })
            .from(inputRows, {
                opacity: 0,
                height: 0,
                stagger: 0.1,
                ease: "power4.out",
                delay: 0.5
            });
    }
    isOpen = !isOpen;
});
