.PHONY: package
package:
	quasar build --mode electron --target all -b packager

.PHONY: installer
installer:
	electron-installer-dmg ./dist/electron/axioms-jwt-debugger-darwin-x64/axioms-jwt-debugger.app axioms-jwt-debugger.app --out dist/Installers/
	electron-installer-debian --src dist/electron/axioms-jwt-debugger-linux-x64/ --dest dist/installers/ --arch all
	electron-installer-windows --src dist/electron/axioms-jwt-debugger-win32-x64/ --dest dist/installers/