
/* IMPORT */

const path = require ( 'path' ),
      filenamify = require ( 'filenamify' ),
      File = require ( './file' );

/* PATH */

const Path = {

  _allowedPaths: {}, // Map of filePath => timestamp, ensuring we don't return the same path mutliple times within some amount of time, in order to avoid race conditions //UGLY

  _checkAllowedPath ( filePath ) {

    if ( !Path._allowedPaths[filePath] || ( Path._allowedPaths[filePath] + 5000 ) < Date.now () ) {

      Path._allowedPaths[filePath] = Date.now ();

      return true;

    }

    return false;

  },

  async getAllowedPath ( folderPath, baseName ) {

    baseName = baseName
                  .replace ( /\//g, '∕' ); // Preserving a dash-like character

    let {name, ext} = path.parse ( baseName );

    name = Path.sanitize ( name );

    for ( let i = 1;; i++ ) {

      const suffix = i > 1 ? ` (${i})` : '',
            fileName = `${name}${suffix}${ext}`,
            filePath = path.join ( folderPath, fileName );

      if ( await File.exists ( filePath ) ) continue;

      if ( !Path._checkAllowedPath ( filePath ) ) continue;

      return { folderPath, filePath, fileName };

    }

  },

  sanitize ( filePath ) {

    return filenamify ( filePath, { replacement: ' ' } ).trim ();

  }

};

/* EXPORT */

module.exports = Path;
