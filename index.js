/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license
 */
import 'laxar/polyfills';
import { bootstrap } from 'laxar';

import * as angularAdapter from 'laxar-angular-adapter';
import * as reactAdapter from 'laxar-react-adapter';
import * as vueAdapter from 'laxar-vue-adapter';
import * as elmAdapter from 'laxar-elm-adapter';

import artifacts from 'laxar-loader/artifacts?flow=main';
console.log( artifacts );

const config = {
   name: 'LaxarJS Adapter Demo',
   flow: {
      name: 'main'
   },
   router: {
      query: {
         enabled: true
      },
      pagejs: {
         hashbang: true
      }
   },
   logging: {
      threshold: 'TRACE'
   },
   theme: 'default',
   tooling: {
      enabled: true
   }
};

bootstrap( document.querySelector( '[data-ax-page]' ), {
   widgetAdapters: [ angularAdapter, reactAdapter, vueAdapter, elmAdapter ],
   configuration: config,
   artifacts
} );
