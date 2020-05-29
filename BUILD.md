# Axioms JWT Debugger (axioms-jwt-debugger)

Axioms JWT Debugger

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
quasar dev -m pwa
quasar dev --mode electron
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
quasar build --mode pwa
quasar build --mode electron
quasar build --mode electron --target all -b packager
quasar build --mode electron --target linux -b packager
```

### Install Electron Packager
```bash
# For use from the CLI
brew cask install xquartz
brew cask install wine-stable
npm install electron-packager -g
npm i electron-installer-dmg -g
npm install -g electron-installer-debian
npm install -g electron-installer-windows
```

### Build package and installer

```bash
make package
make installer
```

OR,

Using Electron packager [See details](https://github.com/electron/electron-packager)

Mac Installer ([See details](https://github.com/electron-userland/electron-installer-dmg))
```bash
electron-installer-dmg ./dist/electron/axioms-jwt-debugger-darwin-x64/axioms-jwt-debugger.app axioms-jwt-debugger.app --out dist/Installers/
```

Debian Linux Installer ([See details](https://github.com/electron-userland/electron-installer-debian))

```
electron-installer-debian --src dist/electron/axioms-jwt-debugger-linux-x64/ --dest dist/installers/ --arch all
```

Windows Installer ([See details](https://github.com/electron-userland/electron-installer-windows))

```
electron-installer-windows --src dist/electron/axioms-jwt-debugger-win32-x64/ --dest dist/installers/
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).


