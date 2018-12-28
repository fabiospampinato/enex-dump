
/* IMPORT */

const _ = require ( 'lodash' ),
      Config = require ( './config' ),
      Content = require ( './content' ),
      File = require ( './file' ),
      Parse = require ( './parse' ),
      Path = require ( './path' ),
      Utils = require ( './utils' );

/* DUMP */

const Dump = {

  async _xml2data ( xml ) {

    if ( !xml ) return [];

    return await Promise.all ( _.castArray ( xml['en-export'].note ).map ( async note => ({
      title: note.title,
      content: await Parse.content ( note.content, note.title ),
      created: (note.created && Parse.date ( note.created )) || new Date(),
      updated: (note.updated && Parse.date ( note.updated )) || new Date(),
      tags: _.castArray ( note.tag || [] ),
      attachments: Config.dump.attachments && note.resource && _.castArray ( note.resource ).filter ( resource => resource.data ).map ( resource => ({
        buffer: Buffer.from ( resource.data, 'base64' ),
        fileName: resource['resource-attributes']['file-name'] || 'Untitled'
      }))
    })));

  },

  async enex () {

    const xml = await Promise.all ( Config.path.src.map ( Parse.xml ) ),
          datas = await Promise.all ( xml.map ( Dump._xml2data ) ),
          data = _.flatten ( datas );

    if ( !data.length ) Utils.throw ( 'Nothing to dump, is the path correct?' );

    await Dump.data ( data );

  },

  async data ( data ) {

    return await Promise.all ( data.map ( async datum => {

      const attachments = Config.dump.attachments ? await Dump.attachments ( datum.attachments ) : [];

      if ( Config.dump.metadata ) {

        let metadata = {
          tags: [...datum.tags, ...Config.dump.tags],
          attachments,
          created: datum.created.toISOString ()
        };

        metadata = _.pickBy ( metadata, _.negate ( _.isEmpty ) );

        datum.content = Content.metadata.set ( datum.content, metadata );

      }

      if ( Config.dump.notes ) {

        await Dump.note ( datum );

      }

    }));

  },

  async attachments ( attachments ) {

    if ( !attachments ) return [];

    return await Promise.all ( attachments.map ( async attachment => {

      const {filePath, fileName} = await Path.getAllowedPath ( Config.attachments.path, attachment.fileName );

      await File.write ( filePath, attachment.buffer );

      return fileName;

    }));

  },

  async note ( note ) {

    const {filePath, fileName} = await Path.getAllowedPath ( Config.notes.path, `${note.title}.${Config.dump.extension}` );

    await File.write ( filePath, note.content );

    return fileName;

  }

};

/* EXPORT */

module.exports = Dump;
