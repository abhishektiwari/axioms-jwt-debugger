<template>
  <div class="column items-center" v-if="!$q.platform.is.electron">
    <div class="col" v-if="$q.platform.is.desktop && $q.platform.is.mac">
      <q-banner rounded class="bg-grey-3">
        Download the JWT Debugger for Mac Desktop
        <q-btn
          unelevated
          round
          color="primary"
          icon="fas fa-download"
          @click="
            launch(
              'https://github.com/axioms-io/axioms-jwt-debugger/releases/download/0.0.1/JWTDebugger.app.dmg'
            )
          "
        />
      </q-banner>
    </div>
  </div>
</template>
<script>
import { Platform, openURL } from 'quasar'
export default {
  launch(url) {
    openURL(url)
  }
}
</script>
