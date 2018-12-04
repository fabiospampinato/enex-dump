
/* IMPORT */

const _ = require ( 'lodash' ),
      fs = require ( 'fs' ),
      mkdirp = require ( 'mkdirp' ),
      path = require ( 'path' ),
      Config = require ( './config' ),
      Content = require ( './content' ),
      Parse = require ( './parse' ),
      Utils = require ( './utils' );

/* DUMP */

const Dump = {

  _getAllowedPath ( folderPath, baseName ) {

    baseName = baseName.replace ( /\//g, '∕' ); // Preserving a dash-like character

    const {name, ext} = path.parse ( baseName );

    for ( let i = 1;; i++ ) {

      const suffix = i > 1 ? ` (${i})` : '',
            fileName = `${name}${suffix}${ext}`,
            filePath = path.join ( folderPath, fileName );

      try {

        fs.accessSync ( filePath );

      } catch ( e ) {

        return { folderPath, filePath, fileName };

      }

    }

  },

  _getAllowedAttachmentPath ( attachment ) {

    const folderPath = path.join ( Config.path.dst, 'attachments' );

    return Dump._getAllowedPath ( folderPath, attachment.fileName );

  },

  _getAllowedNotePath ( note ) {

    const folderPath = path.join ( Config.path.dst, 'notes' );

    return Dump._getAllowedPath ( folderPath, `${note.title}.${Config.dump.extension}` );

  },

  async _xml2data ( xml ) {

    if ( !xml ) return [];

    return await Promise.all ( xml['en-export'].note.map ( async note => ({
      title: note.title[0],
      content: await Parse.content ( note.content[0], note.title[0] ),
      created: Parse.date ( note.created[0] ),
      updated: Parse.date ( note.updated[0] ),
      tags: note.tag || [],
      attachments: Config.dump.attachments && note.resource && note.resource.map ( resource => ({
        buffer: Buffer.from ( resource.data[0]._, resource.data[0]['$'].encoding ),
        fileName: resource['resource-attributes'][0]['file-name'][0]
      }))
    })));

  },

  async enex () {

    const xml = await Promise.all ( Config.path.src.map ( Parse.xml ) ),
          datas = await Promise.all ( xml.map ( Dump._xml2data ) ),
          data = _.flatten ( datas );

    if ( !data.length ) Utils.throw ( 'Nothing to dump, is the path correct?' );

    Dump.data ( data );

  },

  data ( data ) {

    data.forEach ( data => {

      const attachments = Config.dump.attachments ? Dump.attachments ( data.attachments ) : [];

      if ( Config.dump.metadata ) {

        let metadata = {
          tags: [...data.tags, ...Config.dump.tags],
          attachments,
          created: data.created.toISOString ()
        };

        metadata = _.pickBy ( metadata, _.negate ( _.isEmpty ) );

        data.content = Content.metadata.set ( data.content, metadata );

      }

      if ( Config.dump.notes ) {

        Dump.note ( data );

      }

    });

  },

  attachments ( attachments ) {

    if ( !attachments ) return [];

    return attachments.map ( attachment => {

      const {folderPath, filePath, fileName} = Dump._getAllowedAttachmentPath ( attachment );

      mkdirp.sync ( folderPath );

      fs.writeFileSync ( filePath, attachment.buffer );

      return fileName;

    });

  },

  note ( note ) {

    const {folderPath, filePath, fileName} = Dump._getAllowedNotePath ( note );

    mkdirp.sync ( folderPath );

    fs.writeFileSync ( filePath, note.content );

    return fileName;

  }

};

/* EXPORT */

module.exports = Dump;
