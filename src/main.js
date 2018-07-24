
//styles 
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/cyborg/bootstrap.css'
import 'ladda/dist/ladda-themeless.min.css';
import './components/micromodal/micromodal.scss';
import './libs/minitoast/scss/minitoast.scss';
import './libs/minitoast/scss/minitoast-block-card.scss';
import './styles/style.scss';
//end styles

// polyfills
import 'dom4';
import './libs/polyfills/Function.prototype.bind.js';
import './libs/polyfills/Promise.js';
import './libs/polyfills/Uint8Array.js';
// end polyfills


import init from './init.js';
import App from './components/App.html';

window.onload = init(() => {

  new App({
    target: document.getElementById('app')
  });

});

export default 'AdoPisoWiFi';

