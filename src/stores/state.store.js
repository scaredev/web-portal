import { Store } from 'svelte/store.js';
import connectOrPauseBtnStore from '../components/connect-or-pause-btn/connect-or-pause-btn.store.js';

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
  'wifiRestarting'
], (socketDisconnected, serverRebooting, serverShutdown, wifiRestarting) => {
  if (socketDisconnected && !(serverRebooting || serverShutdown || wifiRestarting))
    return 'Unable to synchronize connection status.';
  else if (serverRebooting)
    return 'The machine is rebooting.';
  else if (serverShutdown)
    return 'The machine is shutting down';
  else if (wifiRestarting)
    return 'The WiFi is restarting';
  else
    return null;
});

store.on('state', ({current}) => {
  connectOrPauseBtnStore.update(current.config, current.client);
})


export default store;
