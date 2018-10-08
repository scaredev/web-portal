import { Store } from 'svelte/store.js';

class ConnectOrPauseBtnStore extends Store {
  update(config, client) {

    const show = client.remaining_time > 0 &&
      (client.status == 'disconnected' ||
        (config.allow_pause && client.remaining_time < config.allow_pause_time)
      )
    const klass = client.status == 'connected'? 'btn-warning' : 'btn-success';
    const btnText = client.status == 'disconnected' ? 'buttons.CONNECT'  : 'buttons.PAUSE_TIME';

    this.set({
      status: client.status,
      class: klass,
      btnText,
      show
    });
  }
};

const store = new ConnectOrPauseBtnStore({
  class: '',
  show: false,
  btnText: '',
  status: ''
});

export default store;
