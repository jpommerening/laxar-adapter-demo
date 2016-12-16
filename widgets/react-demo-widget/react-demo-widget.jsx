import React from 'react';

export default {
   name: 'reactDemoWidget',
   injections: [ 'axContext', 'axReactRender' ],
   create( context, render ) {
      return {
         onDomAvailable() {
            return render( <strong dangerouslySetInnerHTML={{__html: context.features.htmlText }}></strong> );
         }
      };
   }
};
