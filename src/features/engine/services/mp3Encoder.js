import { Mp3Encoder } from '@breezystack/lamejs';

/**
 * Client-Side MP3 Encoder using @breezystack/lamejs (Modern ESM)
 * Encodes PCM AudioBuffer into MP3 with customizable bitrate and trimming
 */

export async function encodeMP3(audioBuffer, options = {}, onProgress) {
  const {
    bitrate = 320, // 320, 192, 128 kbps
    startSec = 0,
    endSec = null
  } = options;

  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;

  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = endSec !== null 
    ? Math.min(Math.floor(endSec * sampleRate), audioBuffer.length)
    : audioBuffer.length;

  const numSamples = Math.max(0, endSample - startSample);
  if (numSamples <= 0) throw new Error('Invalid trim range');

  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

  // Convert Float32 to Int16
  const leftInt16 = new Int16Array(numSamples);
  const rightInt16 = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const l = Math.max(-1, Math.min(1, leftChannel[startSample + i]));
    leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7FFF;

    const r = Math.max(-1, Math.min(1, rightChannel[startSample + i]));
    rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7FFF;
  }

  // Initialize Mp3Encoder
  const mp3Encoder = new Mp3Encoder(numChannels, sampleRate, bitrate);
  const mp3Data = [];

  const sampleBlockSize = 1152;
  const totalBlocks = Math.ceil(numSamples / sampleBlockSize);

  for (let i = 0; i < numSamples; i += sampleBlockSize) {
    const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
    let mp3buf;

    if (numChannels === 1) {
      mp3buf = mp3Encoder.encodeBuffer(leftChunk);
    } else {
      const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
      mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
    }

    if (mp3buf && mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    // Report progress periodically
    const currentBlock = Math.floor(i / sampleBlockSize);
    if (currentBlock % 20 === 0 && onProgress) {
      const percent = Math.round((currentBlock / totalBlocks) * 100);
      onProgress(percent);
      // Give browser UI a micro-task tick
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const endBuf = mp3Encoder.flush();
  if (endBuf && endBuf.length > 0) {
    mp3Data.push(endBuf);
  }

  onProgress?.(100);

  const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
  return mp3Blob;
}
