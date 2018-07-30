# enex-dump

Dump the content of `.enex` files, including attachements, some metadata and optionally converting notes to Markdown.

`enex` is the format used by [Evernote](https://evernote.com) for exporting notes.

## Install

```shell
$ npm install -g enex-dump
```

## Usage

```shell
enex-dump --src ./my-notes.enex
```

This app can export notes in html or Markdown. Run the following to read all about the supported options:

```shell
enex-dump --help
```

## Why?

I've finally decided to build my own Evernote replacement, no WYSIWYG, no proprietary formats, no bloat, just Markdown + tags + syncing via dropbox/gdrive/whatever -- this app is the first step towards that.

## License

MIT © Fabio Spampinato
