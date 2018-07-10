import state from '../stores/state.store.js';
import Sounds from './sounds.js'
import ClientHttp from './client.http.js';

let intv;
let isPLayingWarning;

class InternalTimer {

  static start() {
    intv = setInterval(() => {
      let config = state.get().config;
      let allow_pause = state.get().allow_pause;
      let socketDisconnected = state.get().socketDisconnected;
      if (!socketDisconnected) {
        let data = state.get().client;
        if (data.counter_timer && data.counter_timer > 0) {
          data.counter_timer = data.counter_timer - 1;
          if (data.counter_timer <= 0) {
            data.is_paying = false;
          }
        }

        if (data.status == 'disconnected' && data.remaining_time > 0) {
          data.pause_length = data.pause_length + 1
          if (data.pause_length > config.allow_pause_validity && !data.is_paying)
            ClientHttp.start()
        }

        if (!allow_pause || data.status == 'connected') {

          data.remaining_time = data.remaining_time - 1;

          let is_1_min_left = data.remaining_time <= 60 && data.remaining_time >= 55;
          let is_15_secs_left = data.remaining_time <= 15 && data.remaining_time >= 10;
          if ((is_1_min_left || is_15_secs_left) && !isPLayingWarning) {
            try {
              Sounds.insertCoin.play();
            } catch(e) {
              console.log(e);
            }
            isPLayingWarning = true;
          }
          let is_done_1_min = data.remaining_time <= 55 && data.remaining_time > 15;
          let is_done_15_sec = data.remaining_time <= 10;
          if ((is_done_1_min || is_done_15_sec) && isPLayingWarning) {
            try {
              Sounds.insertCoin.stop();
            } catch(e) {
              console.log(e);
            }
            isPLayingWarning = false;
          }

        }

        state.set({client: data});

      }

    }, 1000);

  }

  static stop() {
    if (intv) clearInterval(intv);
  }

}

export default InternalTimer
