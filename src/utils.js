
/* IMPORT */

const chalk = require ( 'chalk' );

/* UTILS */

const Utils = {

  throw ( msg ) {

    console.error ( chalk.red ( msg ) );

    process.exit ( 1 );

  }

};

/* EXPORT */

module.exports = Utils;
