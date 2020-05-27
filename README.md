# JWT Debugger (axioms-jwt-tools)

Axioms JWT Debugger

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
quasar dev --mode electron
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
quasar build --mode electron
```

### Install Electron Packager
```bash
# For use from the CLI
npm install electron-packager -g
npm i electron-installer-dmg -g
npm install -g electron-installer-debian
```

Mac Installer ([See details](https://github.com/electron-userland/electron-installer-dmg))
```bash
electron-installer-dmg ./dist/electron/JWT\ Debugger-darwin-x64/JWT\ Debugger.app JWTDebugger.app --dest dist/Installers/
```

Linux Installer ([See details](https://github.com/electron-userland/electron-installer-debian))
å

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).


