import { Component, NgModule, OnDestroy } from '@angular/core';

@Component( {
   selector: 'angular2-demo-widget',
   template: '<strong>{{features.htmlText}}</strong>'
} )
export class Angular2DemoWidget {
}

@NgModule( {
   imports: [],
   exports: [ Angular2DemoWidget ],
   declarations: [ Angular2DemoWidget ]
} )
export class Angular2DemoWidgetModule { }
