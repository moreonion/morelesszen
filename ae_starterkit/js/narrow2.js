/*
 * (c) 2013 more onion
 */
(function(w) {
  "use strict";
  if (typeof w.respond !== undefined) {
    w.matchMedia = w.matchMedia || function ( q ) {
      var eachq,
        eql,
        thisq,
        doc = w.document,
        docElem = doc.documentElement,
        mediastyles = [],
        respond = w.respond;

      eachq = q.split( "," );
      eql = eachq.length;

      for( var j = 0; j < eql; j++ ){
        thisq = eachq[ j ];

        if( respond.unsupportedmq ( thisq ) ) {
          continue;
        }

        mediastyles.push( {
          media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
          hasquery : thisq.indexOf("(") > -1,
          minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
          maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
        } );
      }

      function queryMatches() {
        for( var i in mediastyles ) {
          if( mediastyles.hasOwnProperty( i ) ){
            var thisstyle = mediastyles[ i ],
              min = thisstyle.minw,
              max = thisstyle.maxw,
              minnull = min === null,
              maxnull = max === null,
              em = "em",
              name = "clientWidth",
              docElemProp = docElem[ name ],
              currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp;

            // TODO parse em
            if( !!min ){
              min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || respond.getEmValue() ) : 1 );
            }
            if( !!max ){
              max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || respond.getEmValue() ) : 1 );
            }

            // if there a media query, or min or max is not null,
            // and if either is present, they're true
            if( thisstyle.hasquery && ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
              return true;
            }
          }
        }
        return false;
      }

      return {
        matches: queryMatches(),
        media: q
      };
    }
  }
})(this);
