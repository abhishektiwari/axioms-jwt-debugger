<template>
  <div class="column items-center" v-if="!$q.platform.is.electron">
    <div class="col" v-if="$q.platform.is.desktop && $q.platform.has.mac">
      <q-banner rounded class="bg-grey-3">
        Download the JWT Debugger for Mac Desktop
        <q-btn
          unelevated
          round
          color="primary"
          icon="fas fa-download"
          @click="
            launch(
              'https://github.com/axioms-io/axioms-jwt-debugger/releases/download/0.0.3/axioms-jwt-debugger.app_0.0.3.dmg'
            )
          "
        />
      </q-banner>
    </div>
    <div class="col" v-if="$q.platform.is.desktop && $q.platform.has.win">
      <q-banner rounded class="bg-grey-3">
        Download the JWT Debugger for Windows Desktop
        <q-btn
          unelevated
          round
          color="primary"
          icon="fas fa-download"
          @click="
            launch(
              'https://github.com/axioms-io/axioms-jwt-debugger/releases/download/0.0.3/axioms_jwt_debugger-0.0.3-setup.exe'
            )
          "
        />
      </q-banner>
    </div>
    <div class="col" v-if="$q.platform.is.desktop && $q.platform.has.linux">
      <q-banner rounded class="bg-grey-3">
        Download the JWT Debugger for Debian Desktop
        <q-btn
          unelevated
          round
          color="primary"
          icon="fas fa-download"
          @click="
            launch(
              'https://github.com/axioms-io/axioms-jwt-debugger/releases/download/0.0.3/axioms-jwt-debugger_0.0.3_all.deb'
            )
          "
        />
      </q-banner>
    </div>
  </div>
</template>
<script>
import { openURL, useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar();
    return { $q };
  },
  methods: {
    launch(url) {
      openURL(url)
    }
  }
}
</script>
