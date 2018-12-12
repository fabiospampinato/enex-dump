
/* IMPORT */

const fs = require ( 'fs' ),
      mkdirp = require ( 'mkdirp' ),
      path = require ( 'path' ),
      pify = require ( 'pify' );

/* FILE */

const File = {

  async exists ( filePath ) {

    try {

      await pify ( fs.access )( filePath, fs.constants.F_OK );

      return true;

    } catch ( e ) {

      return false;

    }

  },

  async read ( filePath ) {

    try {

      return ( await pify ( fs.readFile )( filePath, { encoding: 'utf8' } ) ).toString ();

    } catch ( e ) {

      return '';

    }

  },

  async write ( filePath, content ) {

    try {

      return await pify ( fs.writeFile )( filePath, content );

    } catch ( e ) {

      if ( e.code === 'ENOENT' ) {

        try {

          await pify ( mkdirp )( path.dirname ( filePath ) );

          return await pify ( fs.writeFile )( filePath, content );

        } catch ( e ) {}

      }

    }

  }

};

/* EXPORT */

module.exports = File;
