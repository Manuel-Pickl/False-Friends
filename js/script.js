// window.addEventListener('click', e => {
//     window.addEventListener('devicemotion', event => {
//         console.log("accelerationIncludingGravity.x: " + event.accelerationIncludingGravity.x);
//         console.log("accelerationIncludingGravity.y: " + event.accelerationIncludingGravity.y);
//         console.log("acceleration.x: " + event.acceleration.x);
//         console.log("acceleration.y: " + event.acceleration.y);
//         console.log(event.rotationRate);
//     }, true);
// })


const gravitation = 0.1;
const speedLimit = 10;
var x = 0, y = 0;

const fps = 60;

var ball = new Ball();


window.addEventListener('deviceorientation', event => {
      y = event.beta;
      x = event.gamma;
});

setInterval(function() {
    ball.update();
}, 1000 / fps);






// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});


const pwaInstall = document.querySelector(".pwa-install");
pwaInstall.addEventListener('click', async () => {
    // Hide the app provided install promotion
    // hideInstallPromotion();

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });