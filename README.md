# AdoPisoWiFi - Web Portal

Powered by [Svelte](https://svelte.technology)

---

## Prerequisites
 - Node.js (latest)
 - Working AdoPisoWiFi vendo (with or without external AP)

## Get started

Install the dependencies...

```bash
cd web-portal
npm install rollup -g
npm install
```

## Initialize config files

```bash
cp api/config.json.sample api/config.json
cp proxy.config.json.sample proxy.config.json
```

## Preparing API proxy

The portal needs a working RPI with [AdoPisoWiFi](https://www.adopisowifi.com/articles/how-to-make-wifi-vendo-using-raspberry-pi/) software installed. Calls to the API are proxied to the host set in `proxy.config.json`. Make sure the PC where you are developing is connected to the LAN of RPI with IP address `10.0.0.1` either on internal or external accesspoint.

## Start local server

Linux/MacOS
```bash
npm run dev
```

Windows

On windows, you need to open two separate terminals.

Terminal 1:
```bash
rollup -c -w
```

Terminal 2:
```
node api/server.js
```

Open your browser and navigate to [localhost:4444](http://localhost:4444). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.



