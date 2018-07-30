
/* IMPORT */

const yaml = require ( 'js-yaml' );

/* MATTER */

const Matter = {

  options: {
    flowLevel: 1,
    indent: 2,
    lineWidth: 8000
  },

  parse ( str ) {

    return yaml.safeLoad ( str, Matter.options );

  },

  stringify ( obj ) {

    return yaml.safeDump ( obj, Matter.options );

  }

};

/* EXPORT */

module.exports = Matter;
