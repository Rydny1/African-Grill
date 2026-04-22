const MIN_LOADING_TIME = 1100; // 3 seconds
const startTime = Date.now();

window.addEventListener('load', () => {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';

    setTimeout(() => {
      preloader.remove();
    }, 200);
  }, remaining);
});
