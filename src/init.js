import Http from './services/http.js';
import imagePreloader from 'image-preloader';
import catchHttpError from './services/catch-http-error.js';

const init = (initApp) => {

  let animation_delay = 500;

  let html = document.getElementsByTagName('html')[0];
  let loadingCon = document.getElementById('loading-container');
  let poweredby = document.getElementById('powered-by');
  let loading = document.getElementById('loading');
  let loadingText = document.getElementById('loading-text');
  let conText = document.getElementById('connecting-text');
  let app = document.getElementById('app');
  let count = 0;
  let interval;

  loading.style.opacity = 0;

  (new window.Promise(resolve => {
    setTimeout(resolve, animation_delay)
  }))
    .then(() => {
      loadingText.remove();
      conText.style.display = 'block';
      loading.style.opacity = 1;

      //make sure to animate fading identifying device
      interval = setInterval(() => {
        count += 1;
      }, 1);

      let http = [
        Http.get("/connect"),
        Http.get("/client/config"),
        Http.get("/settings/banners")
      ];

      return window.Promise.all(http);
    })
    .then(xmlhttp => {
      const banners = xmlhttp[2].data;
      let preloads = banners.map(file => {
        const url = '/img/banner/' + file;
        return imagePreloader.simplePreload(url);
      });
      return Promise.all(preloads).then(() => {
        return xmlhttp;
      })
    })
    .then(xmlhttp => {

      clearInterval(interval);

      let delay = animation_delay - count;
      delay = delay > 0 ? delay : 0;

      window.clientData = xmlhttp[0].data;
      window.config = xmlhttp[1].data;
      window.banners = xmlhttp[2].data;

      initApp();

      setTimeout(() => {

        loadingCon.style.opacity = 0;

        setTimeout(() => {
          loadingCon.remove();
          html.classList.remove('loading');
          html.classList.add('loaded');
          app.style.display = 'block';
          app.style.opacity = 1;
        }, animation_delay);

      }, delay);

    })
    .catch(xmlhttp => {
      catchHttpError(xmlhttp);
    });
};

export default init;

