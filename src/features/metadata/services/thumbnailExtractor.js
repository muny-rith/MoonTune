/**
 * High-Resolution Frame Grabber
 * Captures a video frame and converts it to a 500x500 JPEG blob for Album Art
 */

export async function extractVideoThumbnail(file, seekTime = null) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Choose timestamp: default to 15% into the video or 1.5s
      const targetTime = seekTime !== null ? seekTime : Math.min(video.duration * 0.15, 2.0);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const size = 500;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Center crop / cover math
        const videoRatio = video.videoWidth / video.videoHeight;
        let sWidth, sHeight, sx, sy;

        if (videoRatio > 1) { // Landscape
          sHeight = video.videoHeight;
          sWidth = video.videoHeight;
          sx = (video.videoWidth - sWidth) / 2;
          sy = 0;
        } else { // Portrait / Square
          sWidth = video.videoWidth;
          sHeight = video.videoWidth;
          sx = 0;
          sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
              resolve({
                blob,
                dataUrl,
                width: size,
                height: size
              });
            } else {
              reject(new Error('Failed to generate thumbnail blob'));
            }
          },
          'image/jpeg',
          0.9
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
  });
}
