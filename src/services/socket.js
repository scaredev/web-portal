import io from "socket.io-client";
import Http from '../services/http.js';
import ClientHttp from './client.http.js';
import Sounds from '../services/sounds.js';
import state from '../stores/state.store.js';
import notify from './notify.js';
import formatSeconds from './format-seconds.js';
import voucherStore from '../components/micromodal/store.js';
import VoucherModal from '../components/voucher-modal/VoucherModal.html';
import Redirect from './redirect.js';
import translator from './translator.js';

class Socket {
  init() {

    let socket = io({ forceBase64: true });

    socket.on('connect', () => {
      const prev = state.get();
      state.set({
        socketDisconnected: false,
        serverRebooting: false,
        serverShutdown: false,
        wifiRestarting: false
      })
      if (prev.serverShutdown || prev.serverRebooting || prev.wifiRestarting) {
        notify.success({
          title: 'Yehey!',
          text: translator('toast.success.MACHINE_IS_UP')
        });
        setTimeout(window.location.reload, 1500)
      }
      if (prev.socketDisconnected) {
        ClientHttp.syncClient()
          .then(() => {
            socket.emit('register', state.get().client.ip_address);
          });
      } else {
        socket.emit('register', state.get().client.ip_address);
      }

      Http.setSocketID(socket.id)

    });

    socket.on('disconnect', () => {
      state.set({socketDisconnected: true})
    })

    socket.on('payment:started', client => {
      state.set({
        pageTitle: translator('PLEASE_WAIT') + '...',
        client
      })
    });

    socket.on('voucher:updated', data => {
      state.set({
        pageTitle: translator('PAY_FOR_VOUCHER'),
        voucher: {
          total_time: data.total_time
        },
        client: data.client
      });
      notify.success({
        title: `${translator('toast.success.TOTAL_AMOUNT')}: ${data.total_credits}`,
        text: `${formatSeconds(data.total_time, 'short')} ${translator('toast.success.ADDED_TO_VOUCHER')}`
      })
      try {
        Sounds.coinInserted.play();
      } catch(e) {
        console.log(e)
      }
    })

    socket.on('voucher:created', voucher => {
      voucherStore.set({
        show: true,
        component: VoucherModal,
        data: voucher
      });
      try {
        Sounds.connected.play();
      } catch(e) {
        console.log(e);
      }
    });

    socket.on('internet:status:changed', result => {
      state.set({online: result.online});
    });

    socket.on('client:updated', client => {
      state.set({client});
    });

    socket.on('remaining_time:updated', data => {
      notify.success({
        title: `${translator('toast.success.TOTAL_AMOUNT')}: ${data.total_credits}`,
        text: `${translator('toast.success.TOTAL_TIME')}: ${formatSeconds(data.total_time, 'short')} ${translator('toast.success.ADDED')}`
      });
      state.set({
        client: data.client,
        pageTitle: translator('INSERT_COIN_NOW')
      });
      try {
        Sounds.coinInserted.play();
      } catch(e) {
        console.log(e)
      }
    });

    socket.on('config:updated', () => {
      ClientHttp.getConfig();
    });

    socket.on('internet:connected', client => {
      state.set({client});
      notify.success({
        title: 'Yehey!',
        text: translator('toast.success.CONNECTED')
      });
      Redirect.redirect();
      try {
        Sounds.connected.play();
      } catch(e) {
        console.log(e);
      }
    });


    socket.on('internet:disconnected', client => {
      state.set({client});
      notify.error({
        title: 'Opps!',
        text: translator('toast.error.DISCONNECTED')
      });
      try {
        Sounds.disconnected.play();
      } catch(e) {
        console.log(e);
      }
    });

    socket.on('wifi:restarting', function () {
      state.set({
        wifiRestarting: true
      });
      notify.warning(translator('machine_state.WIFI_RESTARTING'))
    });

    socket.on('server:rebooting', function () {
      state.set({
        serverRebooting: true
      });
      notify.warning(translator('machine_state.REBOOTING'))
    });

    socket.on('server:shutdown', function () {
      state.set({
        serverShutdown: true
      });
      notify.warning(translator('machine_state.SHUTTING_DOWN'))
    });

    socket.on('notification', data => {
      notify[data.type]({title: data.title, text: translator(data.text)});
      let config = state.get().config;
      config.notifications.push(data);
      state.set({config})
    })

    socket.on('remove:cookie', () => {
      console.log('shoould delete cookie')
      const customer_token = 'customer_token';
      document.cookie = customer_token + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;'; 
    })

    this.socket = socket;
    return socket;

  }

  getSocket() {
    return this.socket;
  }

}

const instance = new Socket();

export default instance

