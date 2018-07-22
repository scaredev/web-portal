import io from "socket.io-client";
import ClientHttp from './client.http.js';
import Sounds from '../services/sounds.js';
import state from '../stores/state.store.js';
import notify from './notify.js';
import formatSeconds from './format-seconds.js';
import voucherStore from '../components/micromodal/store.js';
import VoucherModal from '../components/voucher-modal/VoucherModal.html';
import Redirect from './redirect.js';

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
          text: 'The wifi machine is up! Please reconnect to the wifi machine.'
        });
      }
      if (prev.socketDisconnected) {
        ClientHttp.syncClient()
          .then(() => {
            socket.emit('register', state.get().client.ip_address);
          });
      } else {
        socket.emit('register', state.get().client.ip_address);
      }
    });

    socket.on('disconnect', () => {
      state.set({socketDisconnected: true})
    })

    socket.on('payment:started', client => {
      state.set({
        pageTitle: 'Please wait...',
        client
      })
    });

    socket.on('voucher:updated', data => {
      state.set({
        pageTitle: 'Pay For Voucher',
        voucher: {
          total_time: data.total_time
        },
        client: data.client
      });
      notify.success({
        title: `Total amount: ${data.total_credits}`,
        text: `${formatSeconds(data.total_time, 'short')} added to voucher`
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
        title: 'Total amount: ' + data.total_credits,
        text: 'Total time: ' + formatSeconds(data.total_time, 'short') + ' added'
      });
      state.set({
        client: data.client,
        pageTitle: 'Insert Coin Now'
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
        text: 'Connected to internet'
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
        text: 'Disconnected from internet'
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
      notify.warning('WiFi is restarting!')
    });

    socket.on('server:rebooting', function () {
      state.set({
        serverRebooting: true
      });
      notify.warning('WiFi machine is restarting!')
    });

    socket.on('server:shutdown', function () {
      state.set({
        serverShutdown: true
      });
      notify.warning('WiFi machine is shutting down!')
    });

    socket.on('notification', data => {
      console.log('notification', data);
      notify[data.type]({title: data.title, text: data.text});
      let config = state.get().config;
      config.notifications.push(data);
      state.set({config})
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

