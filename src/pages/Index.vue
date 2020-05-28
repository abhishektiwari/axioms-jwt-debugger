<template>
  <q-page>
    <div class="q-pa-md">
      <div class="full-width full-height row">
        <div class="col-sm-12 col-md-6 padding5">
          <q-card bordered flat class="no-margin full-height">
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">JWT Token</div>
              <div class="text-caption text-grey">
                Paste your encoded JWT token here
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input
                v-model="token"
                filled
                autogrow
                type="textarea"
                class="jwt_token"
                debounce="500"
                i
                @input="parseJwtToken"
              />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-h6">Public Key</div>
              <div class="text-caption text-grey">
                For RSA and ECDSA signed token paste your JWKS Endpoint URL
              </div>
              <q-input
                outlined
                v-model="jwksUri"
                placeholder="Your JWKS Endpoint"
                debounce="500"
                clearable
                @input="getJwksKeys"
              />
              <q-list
                bordered
                separator
                class="rounded-borders q-mt-sm"
                v-if="publicKeys.length > 0"
              >
                <q-item
                  clickable
                  v-ripple
                  active-class="text-orange"
                  v-for="item in publicKeys"
                  :key="item.kid"
                >
                  <q-item-section avatar>
                    <q-icon name="vpn_key" />
                  </q-item-section>
                  <q-item-section
                    >{{ item.kty }} Key
                    <q-item-label caption>{{ item.kid }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-h6">Private Secret</div>
              <div class="text-caption text-grey">
                For HMAC signed token paste your secret
              </div>
              <q-input
                v-model="secret"
                filled
                autogrow
                type="textarea"
                class="jwt_token"
                @input="parseSecret"
              />
            </q-card-section>
          </q-card>
        </div>
        <q-separator />
        <div class="col-sm-12 col-md-6 padding5">
          <q-card bordered flat class="no-margin full-height">
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">Token Details</div>
              <div class="text-caption text-grey">
                Click to copy the attribute values
              </div>
            </q-card-section>
            <q-separator />
            <ValidationBanners
              :token="token"
              :secret="secret"
              :isValidToken="isValidToken"
              :tokenPayload="tokenPayload"
              :hasPublicKey="hasPublicKey"
              :hasHmacAlg="hasHmacAlg"
            />
            <q-banner dense rounded class="bg-grey-3" v-if="token">
              <div class="text-h6">Token Header</div>
            </q-banner>
            <q-card-section>
              <vue-json-pretty
                :path="'res'"
                :data="tokenHeader"
                @click="handleClick"
                :showSelectController="true"
                :highlightMouseoverNode="true"
                v-if="tokenHeader"
              >
              </vue-json-pretty>
            </q-card-section>
            <q-separator v-if="token" />
            <q-banner dense class="bg-grey-3" v-if="token">
              <div class="text-h6">Token Payload</div>
            </q-banner>

            <vue-json-pretty
              :path="'res'"
              :data="tokenPayload"
              @click="handleClick"
              :showSelectController="true"
              :highlightMouseoverNode="true"
              v-if="tokenPayload"
            >
            </vue-json-pretty>
          </q-card>
        </div>
      </div>
    </div>
    <download-banners />
  </q-page>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import { validateTokenMixin } from '../mixins/validateToken'
import { copyToClipboard } from 'quasar'
import ValidationBanners from 'components/ValidationBanners'
import DownloadBanners from 'components/DownloadBanners'

export default {
  name: 'PageIndex',
  mixins: [validateTokenMixin],
  components: {
    ValidationBanners,
    VueJsonPretty,
    DownloadBanners
  },
  methods: {
    handleClick(path, data) {
      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }
      copyToClipboard(data).then(() => {
        this.$q.notify('Copied')
      })
    }
  },
  created() {
    this.initialToken()
  }
}
</script>

<style lang="css">
.padding5 {
  padding: 5px;
}
.jwt_token {
  font-family: monospace;
}
</style>
