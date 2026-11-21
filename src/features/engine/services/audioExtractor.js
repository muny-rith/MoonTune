/**
 * Audio Extractor using Web Audio API
 * Decodes video media file directly into PCM AudioBuffer in client memory
 */

export async function extractAudioFromVideo(file, onProgress) {
  if (!file) throw new Error('No file provided');

  onProgress?.({ stage: 'reading', percent: 15, text: 'Reading video file...' });
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.({ stage: 'decoding', percent: 45, text: 'Decoding audio stream...' });

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioCtx = new AudioContextClass();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    onProgress?.({ stage: 'analyzing', percent: 85, text: 'Generating waveform...' });

    const waveform = generateWaveformPeaks(audioBuffer, 80);

    onProgress?.({ stage: 'ready', percent: 100, text: 'Audio loaded!' });

    return {
      audioBuffer,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels,
      waveform
    };
  } finally {
    // Clean up audio context
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Downsamples AudioBuffer into normalized peaks (0.1 to 1.0) for visual waveform
 */
export function generateWaveformPeaks(audioBuffer, targetBars = 80) {
  const rawData = audioBuffer.getChannelData(0); // Left/mono channel
  const totalSamples = rawData.length;
  const blockSize = Math.floor(totalSamples / targetBars);
  const peaks = [];

  for (let i = 0; i < targetBars; i++) {
    const start = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[start + j] || 0);
    }
    const avg = sum / blockSize;
    peaks.push(avg);
  }

  // Normalize
  const max = Math.max(...peaks, 0.0001);
  return peaks.map(p => Math.max(0.12, Math.min(1.0, p / max)));
}
