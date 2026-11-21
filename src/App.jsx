import React, { useState, useEffect, useRef } from 'react';
import { MobileAppShell } from './shared/components/layout/MobileAppShell';
import { Header } from './shared/components/layout/Header';
import { VideoPickerCard } from './features/uploader/components/VideoPickerCard';
import { VideoPreviewCard } from './features/uploader/components/VideoPreviewCard';
import { TouchTrimmer } from './features/trimmer/components/TouchTrimmer';
import { MiniPlayerBar } from './features/preview/components/MiniPlayerBar';
import { MetadataDrawer } from './features/metadata/components/MetadataDrawer';
import { PillTabs } from './shared/components/ui/PillTabs';
import { Button } from './shared/components/ui/Button';
import { ProgressBar } from './shared/components/ui/ProgressBar';
import { extractAudioFromVideo } from './features/engine/services/audioExtractor';
import { encodeWAV } from './features/engine/services/wavEncoder';
import { encodeMP3 } from './features/engine/services/mp3Encoder';
import { extractVideoThumbnail } from './features/metadata/services/thumbnailExtractor';
import { attachID3Tags } from './features/metadata/services/id3Tagger';
import { cleanFileName, formatBytes } from './shared/utils/formatters';
import { Zap, Music, Disc, AlertCircle } from 'lucide-react';
import { useHaptic } from './shared/hooks/useHaptic';

export default function App() {
  const { trigger } = useHaptic();

  // File & Media State
  const [videoFile, setVideoFile] = useState(null);
  const [audioData, setAudioData] = useState(null); // { audioBuffer, duration, waveform }
  const [thumbnail, setThumbnail] = useState(null); // { blob, dataUrl }

  // Trimmer State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Settings & Format State
  const [format, setFormat] = useState('mp3-320'); // 'm4a', 'mp3-320', 'mp3-192', 'wav'
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    artist: 'MoonTune',
    album: 'MoonTune Audio'
  });

  // Extraction & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // Output Audio & Preview Player State
  const [outputAudio, setOutputAudio] = useState(null); // { blob, url, extension, sizeText }
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const audioPlayerRef = useRef(null);

  // Sync Audio element playhead
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlayerCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [outputAudio]);

  // Handle Video Selection
  const handleSelectVideo = async (file) => {
    try {
      setErrorMsg(null);
      setVideoFile(file);
      setOutputAudio(null);
      setIsPlaying(false);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const defaultTitle = cleanFileName(file.name);
      setMetadata((prev) => ({ ...prev, title: defaultTitle }));

      setIsProcessing(true);

      // Extract Audio and Thumbnail in parallel
      const [extractedAudio, extractedThumb] = await Promise.allSettled([
        extractAudioFromVideo(file, ({ percent, text }) => {
          setProgress(percent);
          setStatusText(text);
        }),
        extractVideoThumbnail(file)
      ]);

      if (extractedAudio.status === 'fulfilled') {
        const audio = extractedAudio.value;
        setAudioData(audio);
        setTrimStart(0);
        setTrimEnd(audio.duration);
      } else {
        throw new Error(extractedAudio.reason?.message || 'Failed to decode audio track from video.');
      }

      if (extractedThumb.status === 'fulfilled') {
        setThumbnail(extractedThumb.value);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not process this video file.');
      trigger('medium');
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert / Extract Audio Action
  const handleConvert = async () => {
    if (!audioData?.audioBuffer) return;

    try {
      setErrorMsg(null);
      setIsProcessing(true);
      setProgress(5);
      setStatusText('Processing audio...');
      trigger('light');

      let outputBlob = null;
      let extension = 'mp3';

      if (format === 'wav') {
        extension = 'wav';
        setStatusText('Exporting lossless WAV...');
        outputBlob = encodeWAV(audioData.audioBuffer, trimStart, trimEnd);
        setProgress(100);
      } else if (format === 'm4a') {
        // Fast-path M4A or high-speed WAV fallback
        extension = 'm4a';
        setStatusText('Fast-path audio encoding...');
        outputBlob = encodeWAV(audioData.audioBuffer, trimStart, trimEnd);
        setProgress(100);
      } else {
        // MP3 (320 or 192)
        extension = 'mp3';
        const bitrate = format === 'mp3-320' ? 320 : 192;
        setStatusText(`Encoding ${bitrate}kbps MP3...`);

        const rawMp3 = await encodeMP3(
          audioData.audioBuffer,
          { bitrate, startSec: trimStart, endSec: trimEnd },
          (p) => {
            setProgress(Math.max(10, Math.min(95, p)));
          }
        );

        // Attach ID3 tags and cover art
        setStatusText('Embedding album art & ID3 tags...');
        outputBlob = await attachID3Tags(rawMp3, {
          title: metadata.title || 'Converted Audio',
          artist: metadata.artist || 'MoonTune',
          album: metadata.album || 'MoonTune',
          coverBlob: thumbnail?.blob || null
        });
        setProgress(100);
      }

      const url = URL.createObjectURL(outputBlob);
      const sizeText = formatBytes(outputBlob.size);

      setOutputAudio({
        blob: outputBlob,
        url,
        extension,
        sizeText
      });

      // Prepare player
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.load();
      }

      trigger('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Conversion failed: ' + err.message);
      trigger('medium');
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Tap Download
  const handleDownload = () => {
    if (!outputAudio?.url) return;
    const cleanTitle = (metadata.title || 'MoonTune-Audio').replace(/[^a-zA-Z0-9_-]/g, '_');
    const a = document.createElement('a');
    a.href = outputAudio.url;
    a.download = `${cleanTitle}.${outputAudio.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Play / Pause Preview
  const handleTogglePlay = () => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  // Reset to initial state
  const handleReset = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (outputAudio?.url) {
      URL.revokeObjectURL(outputAudio.url);
    }
    setVideoFile(null);
    setAudioData(null);
    setThumbnail(null);
    setOutputAudio(null);
    setIsPlaying(false);
    setErrorMsg(null);
  };

  const formatOptions = [
    { value: 'mp3-320', label: 'MP3', badge: '320k' },
    { value: 'mp3-192', label: 'MP3', badge: '192k' },
    { value: 'wav', label: 'WAV', badge: 'HQ' },
    { value: 'm4a', label: 'M4A', badge: 'Fast' }
  ];

  return (
    <MobileAppShell>
      {/* Hidden audio element for preview */}
      <audio ref={audioPlayerRef} preload="auto" className="hidden" />

      {/* Top Mobile Bar */}
      <Header hasFile={Boolean(videoFile)} onReset={handleReset} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between overflow-y-auto">
        {!videoFile ? (
          /* Step 1: Upload Dropzone */
          <VideoPickerCard
            onFileSelect={handleSelectVideo}
            isLoading={isProcessing}
          />
        ) : (
          /* Step 2: Audio Loaded -> Trimmer & Settings */
          <div className="flex-1 flex flex-col justify-between py-2 space-y-3">
            <div>
              {/* Video Info Card */}
              <VideoPreviewCard
                file={videoFile}
                thumbnail={thumbnail?.dataUrl}
                duration={audioData?.duration || 0}
                onOpenMetadata={() => setIsMetadataOpen(true)}
              />

              {/* Touch Waveform Trimmer */}
              {audioData && (
                <TouchTrimmer
                  duration={audioData.duration}
                  waveform={audioData.waveform}
                  startTime={trimStart}
                  endTime={trimEnd}
                  currentTime={playerCurrentTime}
                  isPlaying={isPlaying}
                  onTrimChange={(start, end) => {
                    setTrimStart(start);
                    setTrimEnd(end);
                  }}
                  onSeek={(time) => {
                    if (audioPlayerRef.current) {
                      audioPlayerRef.current.currentTime = time;
                    }
                  }}
                  onTogglePlay={handleTogglePlay}
                />
              )}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mx-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Format Selector & Convert CTA (Thumb-Zone) */}
            <div className="px-5 pt-2 pb-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2 px-1">
                  Output Format & Quality
                </label>
                <PillTabs
                  options={formatOptions}
                  selected={format}
                  onChange={setFormat}
                />
              </div>

              {/* Progress bar during extraction or conversion */}
              {isProcessing && (
                <div className="pt-1">
                  <ProgressBar percent={progress} statusText={statusText} />
                </div>
              )}

              {/* Primary Action Button */}
              <Button
                fullWidth
                size="lg"
                variant="glow"
                disabled={isProcessing || !audioData}
                onClick={handleConvert}
                icon={Zap}
              >
                {isProcessing ? 'Processing Audio...' : 'Extract & Convert Audio'}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Mini-Player Bar (When Converted) */}
      <MiniPlayerBar
        audioUrl={outputAudio?.url}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onDownload={handleDownload}
        currentTime={playerCurrentTime}
        duration={outputAudio ? Math.max(0, trimEnd - trimStart) : 0}
        formatName={format.toUpperCase()}
        fileSizeText={outputAudio?.sizeText}
      />

      {/* Tag & Album Art Editor Drawer */}
      <MetadataDrawer
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        title={metadata.title}
        artist={metadata.artist}
        album={metadata.album}
        coverUrl={thumbnail?.dataUrl}
        onChangeTitle={(t) => setMetadata((prev) => ({ ...prev, title: t }))}
        onChangeArtist={(a) => setMetadata((prev) => ({ ...prev, artist: a }))}
        onChangeAlbum={(al) => setMetadata((prev) => ({ ...prev, album: al }))}
      />
    </MobileAppShell>
  );
}
