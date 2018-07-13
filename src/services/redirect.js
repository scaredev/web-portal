import state from '../stores/state.store.js';

let redirectTimeout;

class Redirect {

  static redirect() {
    console.log(state.get())
    if (state.get().voucherModalOpen) return;
    const c = state.get().config;
    const hostname = c.domain.subdomain + '.' + c.domain.domain + '.' + c.domain.authority;
    const redirect = 'http://' + hostname;
    if (window.location.hostname != hostname) {
      redirectTimeout = setTimeout(() => {
        let client = state.get().client;
        if (state.get().voucherModalOpen || client.status != 'connected' || client.is_paying) return;
        document.getElementById('app').innerHTML = '<h4 class="ellipsis">Redirecting to ' + hostname + '. Please wait</h4>';
        window.location.assign(redirect);
      }, 3500);
    }
  }

  static cancel() {
    if (redirectTimeout) {
      clearTimeout(redirectTimeout)
      redirectTimeout = null;
    }
  }

}

export default Redirect
