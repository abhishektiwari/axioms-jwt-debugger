<template>
  <q-page>
    <div class="q-pa-md">
      <div class="full-width full-height row">
        <div class="col-6 padding5">
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
        <div class="col-6 padding5">
          <q-card bordered flat class="no-margin full-height">
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">Token Details</div>
              <div class="text-caption text-grey">
                Click to copy the attribute values
              </div>
            </q-card-section>
            <q-separator />
            <div class="q-pa-sm q-gutter-sm" v-if="token && !validToken">
              <q-banner rounded class="bg-red-8 text-white">
                <div class="text-h6">JWT Token is invalid</div>
                The JWT has not been verified and is not valid for use
              </q-banner>
            </div>
            <div class="q-pa-sm q-gutter-sm" v-if="token && validToken">
              <q-banner rounded class="bg-green-8 text-white">
                <div class="text-h6">JWT Token is valid</div>
                JWT Token has been verified using the key
              </q-banner>
            </div>
            <div
              class="q-pa-sm q-gutter-sm"
              v-if="token && !foundPublicKey && !secret"
            >
              <q-banner rounded class="bg-red-8 text-white">
                <div class="text-h6">Key not found</div>
                No matching key was found
              </q-banner>
            </div>
            <div class="q-pa-sm q-gutter-sm" v-if="token && foundPublicKey">
              <q-banner rounded class="bg-green-8 text-white">
                <div class="text-h6">Key found</div>
                A signing key matching <q-badge color="orange">kid</q-badge> was
                found
              </q-banner>
            </div>
            <div class="q-pa-sm q-gutter-sm" v-if="token && validToken">
              <q-banner rounded class="bg-green-8 text-white">
                <div class="text-h6">Signature verified</div>
                The signature of the JWT token has been verified using a key or
                secret
              </q-banner>
            </div>
            <div class="q-pa-sm q-gutter-sm" v-if="token && !validToken">
              <q-banner rounded class="bg-red-8 text-white">
                <div class="text-h6">Signature not verified</div>
                The signature of the JWT has not been verified
              </q-banner>
            </div>
            <div
              class="q-pa-sm q-gutter-sm"
              v-if="token && !isTokenExpired && tokenPayload.exp"
            >
              <q-banner rounded class="bg-red-8 text-white">
                <div class="text-h6">Expired</div>
                The JWT expired on
                {{ new Date(tokenPayload.exp * 1000).toLocaleString() }}
              </q-banner>
            </div>
            <div
              class="q-pa-sm q-gutter-sm"
              v-if="token && isTokenExpired && tokenPayload.exp"
            >
              <q-banner rounded class="bg-green-8 text-white">
                <div class="text-h6">Not expired</div>
                The JWT will expire on
                {{ new Date(tokenPayload.exp * 1000).toLocaleString() }}
              </q-banner>
            </div>
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
  </q-page>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import jws from 'jws'
import axios from 'axios'
import jwktopem from 'jwk-to-pem'
import { copyToClipboard } from 'quasar'

export default {
  name: 'PageIndex',
  data() {
    return {
      token: '',
      jwksUri: null,
      validToken: false,
      isToken: false,
      expiredToken: false,
      validSignature: false,
      tokenPayload: false,
      tokenHeader: false,
      publicKeys: [],
      foundPublicKey: false,
      secret: ''
    }
  },
  methods: {
    async getJwksKeys() {
      let response
      let keys
      try {
        if (this.jwksUri) {
          console.log(this.jwksUri)
          response = await axios.get(this.jwksUri)
          keys = response.data.keys
          if (!keys || !keys.length) {
            console.error('No public keys found')
            this.keyFound = false
          } else {
            this.publicKeys = keys
            this.foundPublicKey = true
            this.parseJwtToken()
          }
        } else {
          console.log('JWKS URI is blank or null')
          this.publicKeys = []
          this.keyFound = false
        }
      } catch (error) {
        throw error
      }
    },
    parseJwtToken() {
      if (this.token) {
        const decoded = jws.decode(this.token)
        this.tokenHeader = decoded.header
        if (typeof decoded.payload === 'object') {
          console.log('object', decoded.payload)
          this.tokenPayload = decoded.payload
        } else {
          console.log('string')
          this.tokenPayload = JSON.parse(decoded.payload)
        }
        if (this.tokenHeader && this.tokenPayload) {
          this.isToken = true
          this.isTokenValid()
        }
      } else {
        this.token = ''
        this.tokenPayload = false
        this.tokenHeader = false
      }
    },
    parseSecret() {
      this.isTokenValidHmac()
    },
    isTokenValid() {
      try {
        const key = this.publicKeys.find(
          key => key.kid === this.tokenHeader.kid
        )
        if (key) {
          this.validToken = jws.verify(this.token, key.alg, jwktopem(key))
        } else {
          console.log('No matching key found')
          this.validToken = false
        }
      } catch (error) {
        console.error(error)
        this.validToken = false
      }
    },
    isTokenValidHmac() {
      try {
        if (this.secret) {
          this.validToken = jws.verify(this.token, 'HS256', this.secret)
        } else {
          console.log('No matching secret found')
          this.validToken = false
        }
      } catch (error) {
        console.error(error)
        this.validToken = false
      }
    },
    handleClick(path, data) {
      copyToClipboard(data).then(() => {
        this.$q.notify('Copied')
      })
    }
  },
  computed: {
    isTokenExpired() {
      if (this.tokenPayload) {
        return Date.now() > this.tokenPayload.exp
      } else {
        return false
      }
    }
  },
  components: {
    VueJsonPretty
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
