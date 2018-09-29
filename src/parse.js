
/* IMPORT */

const fs = require ( 'fs' ),
      {parseString: parseXMLString} = require ( 'xml2js' ),
      pify = require ( 'pify' ),
      Config = require ( './config' ),
      Content = require ( './content' );

/* PARSE */

const Parse = {

  date ( date ) { // From the YYYYMMDDTHHMMSSZ format

    date = date.split ( '' );

    date.splice ( 13, 0, ':' );
    date.splice ( 11, 0, ':' );
    date.splice ( 6, 0, '-' );
    date.splice ( 4, 0, '-' );

    date = date.join ( '' );

    return new Date ( date );

  },

  async content ( content, title ) { // From the HTML-ish format

    return await Content.format[Config.dump.format]( content, title );

  },

  async xml ( source ) { // From XML string or file path

    try {

      source = fs.readFileSync ( source, { encoding: 'utf8' } );

    } catch ( e ) {}

    try {

      return await pify ( parseXMLString )( source );

    } catch ( e ) {}

  }

};

/* EXPORT */

module.exports = Parse;
