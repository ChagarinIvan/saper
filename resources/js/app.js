
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSweetAlert from 'vue-sweetalert'

import App from './components/App'
import Config from './components/Config'
import Game from './components/Saper'

Vue.use(VueSweetAlert);
Vue.use(VueRouter);



const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'config',
            component: Config
        },
        {
            path: '/game',
            name: 'game',
            component: Game,
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    router,
});
