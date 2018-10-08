import { Store } from 'svelte/store.js';
import connectOrPauseBtnStore from '../components/connect-or-pause-btn/connect-or-pause-btn.store.js';
import translator from '../services/translator.js';

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

  if (socketDisconnected && !(serverRebooting || serverShutdown || wifiRestarting))
    return translator('machine_state.UNABLE_TO_SYNCHRONIZE', lang);
  else if (serverRebooting)
    return translator('machine_state.REBOOTING', lang);
  else if (serverShutdown)
    return translator('machine_state.SHUTTING_DOWN', lang);
  else if (wifiRestarting)
    return translator('machine_state.WIFI_RESTARTING', lang);
  else
    return null;

});

store.on('state', ({current}) => {
  connectOrPauseBtnStore.update(current.config, current.client);
})

export default store;

