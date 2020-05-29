import jws from 'jws'
import axios from 'axios'
import jwktopem from 'jwk-to-pem'
import qs from 'qs'

function generateQuickGuid() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  )
}

export const validateTokenMixin = {
  data() {
    return {
      token: '',
      jwksUri: null,
      isValidToken: false,
      expiredToken: false,
      hasValidSignature: false,
      tokenPayload: false,
      tokenHeader: false,
      jwksKeys: [],
      hasJwksKey: false,
      signingAlg: '',
      signingKey: '',
      hmacAlg: ['HS256', 'HS384', 'HS512']
    }
  },
  methods: {
    initialToken() {
      if (window.location.hash) {
        var params = qs.parse(location.hash.replace(/(#!?[^#]+)?#/, '?'), {
          ignoreQueryPrefix: true
        })
        for (const [key, value] of Object.entries(params)) {
          if (key === 'token') {
            this.token = value
            this.parseJwtToken()
          }
          if (key === 'jwks') {
            this.jwksUri = value
            this.getJwksKeys()
          }
        }
        window.location.hash = ''
      }
      if (!this.token && !this.signingKey) {
        this.signingKey = 'secret'
        this.hasJwksKey = false
        this.token = jws.sign({
          header: { alg: 'HS256', typ: 'JWT' },
          privateKey: this.signingKey,
          payload: {
            sub: generateQuickGuid(),
            name: 'John Doe',
            jti: generateQuickGuid(),
            exp: Math.round(new Date().getTime() / 1000) + 300
          }
        })
        this.parseJwtToken()
        this.validateTokenUsingSigningKey()
        this.hasJwksKey = false
        this.signingAlg = 'HS256'
      }
    },
    async getJwksKeys() {
      let response
      let keys
      try {
        if (this.jwksUri) {
          response = await axios.get(this.jwksUri)
          keys = response.data.keys
          if (!keys || !keys.length) {
            console.error('No public keys found')
            this.keyFound = false
          } else {
            this.jwksKeys = keys
            this.hasJwksKey = true
            this.parseJwtToken()
          }
        } else {
          console.log('JWKS URI is blank or null')
          this.jwksKeys = []
          this.hasJwksKey = false
          this.parseJwtToken()
        }
      } catch (error) {
        throw error
      }
    },
    parseJwtToken() {
      if (this.token) {
        this.isValidToken = false
        try {
          const decoded = jws.decode(this.token)
          this.tokenHeader = decoded.header
          if (typeof decoded.payload === 'object') {
            this.tokenPayload = decoded.payload
          } else {
            this.tokenPayload = JSON.parse(decoded.payload)
          }
          if (this.tokenHeader && this.tokenPayload) {
            this.signingAlg = this.tokenHeader.alg
            if (this.jwksKeys && !this.isValidToken) {
              this.validateTokenUsingJwksKey()
            }
            if (this.signingKey && !this.isValidToken) {
              this.validateTokenUsingSigningKey()
            }
          } else {
            this.tokenPayload = false
            this.tokenHeader = false
            this.isValidToken = false
            this.signingAlg = ''
          }
        } catch (error) {
          this.tokenPayload = false
          this.tokenHeader = false
          this.isValidToken = false
          this.signingAlg = ''
        }
      } else {
        this.token = ''
        this.tokenPayload = false
        this.tokenHeader = false
        this.isValidToken = false
        this.signingAlg = ''
      }
    },
    parseSecret() {
      this.validateTokenUsingSigningKey()
    },
    validateTokenUsingJwksKey() {
      try {
        const key = this.jwksKeys.find(key => key.kid === this.tokenHeader.kid)
        if (key) {
          this.isValidToken = jws.verify(
            this.token,
            this.signingAlg,
            jwktopem(key)
          )
        } else {
          console.log('No matching JSON key found')
          this.isValidToken = false
        }
      } catch (error) {
        console.error(error)
        this.isValidToken = false
      }
    },
    validateTokenUsingSigningKey() {
      try {
        if (this.signingKey) {
          this.isValidToken = jws.verify(
            this.token,
            this.signingAlg,
            this.signingKey
          )
        } else {
          console.log('No signing key found')
          this.isValidToken = false
        }
      } catch (error) {
        console.error(error)
        this.isValidToken = false
      }
    }
  },
  computed: {
    hasHmacAlg() {
      return this.hmacAlg.includes(this.signingAlg)
    }
  }
}
