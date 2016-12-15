import ng from 'angular';

Controller.$inject = [ '$scope' ];
function Controller() {
};

export default ng.module( 'angularDemoWidget', [] )
   .controller( 'AngularDemoWidgetController', Controller );
