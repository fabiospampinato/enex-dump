
/* IMPORT */

const {parse: xml2js} = require ( 'fast-xml-parser' ),
      Config = require ( './config' ),
      Content = require ( './content' ),
      File = require ( './file' );

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

  async xml ( filePath ) {

    const content = await File.read ( filePath );

    try {

      return xml2js ( content );

    } catch ( e ) {}

  }

};

/* EXPORT */

module.exports = Parse;
