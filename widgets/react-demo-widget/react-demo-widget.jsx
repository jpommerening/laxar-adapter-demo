const injections = [ 'axContext', 'axReactRender' ];

function create( context, render ) {
   return {
      onDomAvailable() {
         return render( <strong dangerouslySetInnerHtml={ context.features.htmlText }></strong> );
      }
   };
}

export default {
   name: 'reactDemoWidget',
   injections,
   create
};
