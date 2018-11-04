import Http from './http.js';
import catchHttpError from './catch-http-error.js';
import Redirect from './redirect.js';
import state from '../stores/state.store.js';
import notify from './notify.js';
import translator from './translator.js';

class ClientHttp {

  static getConfig() {
    return Http.get('/client/config')
      .then(res => {
        state.set({config: res.data});
        return res;
      })
      .then(res => {
        return ClientHttp.getBanners()
      })
      .catch(catchHttpError);
  }

  static syncClient() {
    return Http.get('/connect')
      .then(res => {
        state.set({client: res.data})
      })
      .catch(catchHttpError);
  }

  static getBanners() {
    return Http.get('/settings/banners')
      .then(res => {
        state.set({banners: res.data});
        return res;
      });
  }

  static que(type) {
    console.log('queing');
    Redirect.cancel();
    return Http.post('/que', { type })
      .then(res => {
        state.set({client: res.data});
        return res;
      })
      .catch(catchHttpError);
  }

  static start() {
    return Http.post('/start')
      .then(res => {
        state.set({client: res.data});
        Redirect.redirect();
        return res;
      })
      .catch(catchHttpError);
  }

  static pause() {
    Redirect.cancel();
    return Http.post('/pause')
      .then(res => {
        notify.success({
          title: 'Info',
          text: translator('toast.success.TIME_PAUSED')
        });
        state.set({client: res.data});
        return res;
      })
      .catch(catchHttpError);
  }

  static activateVoucher(code) {
    return Http.post('/vouchers/activate', {code})
      .then(res => {
        state.set({
          client: res.data
        });
        notify.success({
          text: translator('toast.success.VOUCHER_ACTIVATED') 
        });

        if (state.get().client.status == 'disconnected')
          return ClientHttp.start();
      })
      .catch(catchHttpError);
  }

}

export default ClientHttp

