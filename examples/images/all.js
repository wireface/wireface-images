window.WirefaceImages.ready.then(gallery => {
  document.querySelector('#pause').addEventListener('click', () => {
    if (gallery.status.paused) { gallery.setOptions({ respectReducedMotion: false }); gallery.resume(); }
    else gallery.pause();
  });
});
