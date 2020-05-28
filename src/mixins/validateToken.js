import jws from 'jws'
import axios from 'axios'
import jwktopem from 'jwk-to-pem'

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
      isToken: false,
      expiredToken: false,
      hasValidSignature: false,
      tokenPayload: false,
      tokenHeader: false,
      publicKeys: [],
      hasPublicKey: false,
      secret: ''
    }
  },
  methods: {
    initialToken() {
      if (!this.token && !this.secret) {
        this.secret = 'secret'
        this.hasPublicKey = false
        this.token = jws.sign({
          header: { alg: 'HS256', typ: 'JWT' },
          privateKey: this.secret,
          payload: {
            sub: generateQuickGuid(),
            name: 'John Doe',
            jti: generateQuickGuid(),
            exp: Math.round(new Date().getTime() / 1000) + 60
          }
        })
        this.parseJwtToken()
        this.isTokenValidHmac()
        this.hasPublicKey = false
      }
    },
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
            this.hasPublicKey = true
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
          this.isValidToken = jws.verify(this.token, key.alg, jwktopem(key))
        } else {
          console.log('No matching key found')
          this.isValidToken = false
        }
      } catch (error) {
        console.error(error)
        this.isValidToken = false
      }
    },
    isTokenValidHmac() {
      try {
        if (this.secret) {
          this.isValidToken = jws.verify(this.token, 'HS256', this.secret)
        } else {
          console.log('No matching secret found')
          this.isValidToken = false
        }
      } catch (error) {
        console.error(error)
        this.isValidToken = false
      }
    }
  }
}
