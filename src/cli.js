
/* IMPORT */

const caporal = require ( 'caporal' ),
      chalk = require ( 'chalk' ),
      readPkg = require ( 'read-pkg-up' ),
      updateNotifier = require ( 'update-notifier' ),
      Config = require ( './config' );
      EnexDump = require ( '.' );

/* CLI */

async function CLI () {

  /* APP */

  const {pkg} = await readPkg ({ cwd: __dirname });

  updateNotifier ({ pkg }).notify ();

  const app = caporal.version ( pkg.version );

  /* COMMAND */

  app.option ( '--src <path>', 'Path to the .enex file', app.REPEATABLE, undefined, true )
     .option ( '--dst <path>', 'Path to the dump directory', undefined, './dump' )
     .option ( '--format <format>', 'Convert notes to this format', Config.dump.formats, 'markdown' )
     .option ( '--extension <ext>', 'Save notes using this extension', undefined, 'md' )
     .option ( '--tag <tag>', 'Tag to add to all notes', app.REPEATABLE )
     .option ( '--no-attachments', 'Don\'t dump attachments' )
     .option ( '--no-notes', 'Don\'t dump notes' )
     .option ( '--no-metadata', 'Don\'t add metatada to notes' )
     .action ( () => EnexDump () );

  /* HELP */

  const command = app._defaultCommand;
  const helpLines = [
    `enex-dump ${chalk.green ( '--src' )} ${chalk.blue ( './my-notes.enex' )}`,
    `enex-dump ${chalk.green ( '--src' )} ${chalk.blue ( './my-notes.enex' )} ${chalk.green ( '--format' )} ${chalk.blue ( 'html' )} ${chalk.green ( '--extension' )} ${chalk.blue ( 'html' )}`,
    `enex-dump ${chalk.green ( '--src' )} ${chalk.blue ( './my-notes.enex' )} ${chalk.green ( '--no-metadata' )} ${chalk.green ( '--no-attachments' )}`
  ];

  command.help ( helpLines.join ( '\n' ), { name: 'USAGE - ADVANCED' } );

  /* PARSE */

  caporal.parse ( process.argv );

}

/* EXPORT */

module.exports = CLI;
