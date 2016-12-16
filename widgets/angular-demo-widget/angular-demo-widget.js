import ng from 'angular';

Controller.$inject = [ '$scope' ];
function Controller() {
}

// TODO: change laxar-angular-adapter so I can write "export default"
module.exports = ng.module( 'angularDemoWidget', [] )
   .controller( 'AngularDemoWidgetController', Controller );
