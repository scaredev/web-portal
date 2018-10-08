import { Store } from 'svelte/store.js';
import connectOrPauseBtnStore from '../components/connect-or-pause-btn/connect-or-pause-btn.store.js';
import translations from '../services/translations.js';

const store = new Store({
  pageTitle: '',
  client: {},
  config: {notifications: []},
  banners: [],
  voucher: {},
  online: true,
  socketDisconnected: false,
  serverRebooting: false,
  serverShutdown: false,
  wifiRestarting: false,
  voucherModalOpen: false
});

store.compute('page', [
  'config',
  'client'
], (config, client) => {
  return client.is_paying? client.que_type : 'home';
});

store.compute('allow_pause', [
  'config',
  'client'
], (config, client) => {
  return config.allow_pause && client.remaining_time < config.allow_pause_time && client.pause_length <= config.allow_pause_validity;
})

store.compute('machineState', [
  'socketDisconnected',
  'serverRebooting',
  'serverShutdown',
  'wifiRestarting',
  'config'
], (socketDisconnected, serverRebooting, serverShutdown, wifiRestarting, config) => {

  const lang = config.language || 'en';
  const dict = translations[lang];

  if (socketDisconnected && !(serverRebooting || serverShutdown || wifiRestarting))
    return dict.machine_state.UNABLE_TO_SYNCHRONIZE;
  else if (serverRebooting)
    return dict.machine_state.REBOOTING;
  else if (serverShutdown)
    return dict.machine_state.SHUTTING_DOWN;
  else if (wifiRestarting)
    return dict.machine_state.WIFI_RESTARTING;
  else
    return null;

});

store.on('state', ({current}) => {
  connectOrPauseBtnStore.update(current.config, current.client);
})


export default store;

