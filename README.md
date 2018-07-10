# AdoPisoWiFi - Web Portal

Powered by [Svelte](https://svelte.technology)

---

## Get started

Install the dependencies...

```bash
cd web-portal
npm install
cp api/config.json.sample api/config.json
cp proxy.config.json.sample proxy.config.json
```

## Preparing API proxy

The portal needs a working RPI with AdoPisoWiFi software installed. Make sure you are connected to the LAN of rpi with IP address `10.0.0.1` either on internal or external accesspoint.

Calls to the API are proxied to the host set in `proxy.config.json`.

## Start local server

```bash
npm run dev
```

Navigate to [localhost:4444](http://localhost:4444). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


