#!/usr/bin/env node

/* IMPORT */

const _ = require ( 'lodash' ),
      Config = require ( './config' ),
      Dump = require ( './dump' ),
      Utils = require ( './utils' );

/* ENEX DUMP */

function EnexDump ( options ) {

  _.merge ( Config, options );

  if ( !Config.path.src.length ) Utils.throw ( 'You have to pass at least one src path' );

  if ( !Config.path.dst ) Utils.throw ( 'You have to pass a dst path' );

  if ( !Config.dump.formats.includes ( Config.dump.format ) ) Utils.throw ( `We only support these formats: ${Config.dump.formats.map ( format => `"${format}"` ).join ( ', ' )} ` );

  Dump.enex ();

}

/* EXPORT */

module.exports = EnexDump;
