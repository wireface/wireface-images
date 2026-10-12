import { animateImages } from '../../dist/images.js';
const carousel = document.querySelector('.carousel'), status = document.querySelector('#status');
const gallery = animateImages({ selector: '.carousel',
  onReady: ({ image }) => { status.textContent = `${image.alt} is alive`; },
  onError: ({ error }) => { status.textContent = error.message; },
});
document.querySelector('#previous').onclick = () => carousel.scrollBy({ left: -260 });
document.querySelector('#next').onclick = () => carousel.scrollBy({ left: 260 });
document.querySelector('#pause').onclick = () => {
  if (gallery.status.paused) { gallery.setOptions({ respectReducedMotion: false }); gallery.resume(); }
  else gallery.pause();
  status.textContent = gallery.status.paused ? 'Paused' : 'Playing';
};
document.querySelector('#mood').onchange = event => gallery.setOptions({ mood: event.target.value });
document.querySelector('#add').onclick = event => {
  const image = new Image(240, 260); image.src = '../../assets/skins/arjun.jpg'; image.alt = 'New portrait';
  carousel.append(image); image.scrollIntoView({ block: 'nearest', inline: 'end' });
  event.target.disabled = true;
};
document.querySelector('#destroy').onclick = () => {
  gallery.destroy(); status.textContent = 'Destroyed. Original pictures remain. Reload to start again.';
  for (const control of document.querySelectorAll('.controls button, .controls select')) control.disabled = true;
};
