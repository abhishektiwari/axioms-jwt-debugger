<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          JWT Debugger
        </q-toolbar-title>

        <div>
          <q-btn unelevated color="orange" label="Crafted by Axioms" @click="launch('https://axioms.io')"/>
          <q-btn unelevated round color="primary" icon="fab fa-twitter" @click="launch('https://twitter.com/axioms_io')" />
          <q-btn unelevated round color="primary" icon="fab fa-linkedin" @click="launch('https://www.linkedin.com/company/axioms-io/')" />
          <q-btn unelevated round color="primary" icon="fab fa-github" @click="launch('https://github.com/axioms-io')" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      behavior="mobile"
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @click="launch(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import { openURL } from 'quasar'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Developer',
          caption: 'Axioms Developer Hub',
          icon: 'school',
          link: 'http://developer.axioms.io/'
        },
        {
          title: 'Github',
          caption: 'github.com/axioms-io',
          icon: 'code',
          link: 'https://github.com/axioms-io'
        },
        {
          title: 'Forum',
          caption: 'community.axioms.io',
          icon: 'record_voice_over',
          link: 'http://community.axioms.io/'
        },
        {
          title: 'Twitter',
          caption: '@axioms_io',
          icon: 'rss_feed',
          link: 'https://twitter.com/axioms_io'
        }
      ]
    }
  },
  methods: {
    launch(url) {
      openURL(url)
    }
  }
}
</script>
