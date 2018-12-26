
const path = require ( 'path' );
const EnexDump = require ( '../src/index' );

const src = path.join ( __dirname, 'test.enex' );
const dst = path.join ( __dirname, 'benchmark_output' );

async function run () {

  console.time ( 'benchmark' );

  for ( let i = 0, l = 1000; i < l; i++ ) {

    await EnexDump ({
      path: {
        src: [src],
        dst: dst
      }
    });

  }

  console.timeEnd ( 'benchmark' );

}

run ();
