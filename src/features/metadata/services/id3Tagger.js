import ID3Writer from 'browser-id3-writer';

/**
 * ID3 Tag Writer
 * Injects Title, Artist, Album, and Cover Art into MP3 ArrayBuffer
 */

export async function attachID3Tags(mp3Blob, tags = {}) {
  const {
    title = 'Converted Audio',
    artist = 'MoonTune',
    album = 'MoonTune Audio',
    coverBlob = null
  } = tags;

  const arrayBuffer = await mp3Blob.arrayBuffer();

  try {
    const writer = new ID3Writer(arrayBuffer);
    writer
      .setFrame('TIT2', title)
      .setFrame('TPE1', [artist])
      .setFrame('TALB', album);

    if (coverBlob) {
      const coverBuffer = await coverBlob.arrayBuffer();
      writer.setFrame('APIC', {
        type: 3, // Cover front
        data: coverBuffer,
        description: 'Cover Art'
      });
    }

    writer.addTag();
    return writer.getBlob();
  } catch (err) {
    console.warn('Could not write ID3 tags, returning raw audio:', err);
    return mp3Blob;
  }
}
