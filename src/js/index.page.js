/* === On DOM load === */

if(document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
}

/**
 * Init function, executed on document load
 * Move all functions which need to be executed on pageload here
 */
init = () => {
  Gyro.init();
}
