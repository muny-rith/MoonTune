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
import { Zap, AlertCircle } from 'lucide-react';
import { useHaptic } from './shared/hooks/useHaptic';

export default function App() {
  const { trigger } = useHaptic();

  // File & Media State
  const [videoFile, setVideoFile] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // Trimmer State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Settings & Format State
  const [format, setFormat] = useState('mp3-320');
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
  const [outputAudio, setOutputAudio] = useState(null);
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
        extension = 'm4a';
        setStatusText('Fast-path audio encoding...');
        outputBlob = encodeWAV(audioData.audioBuffer, trimStart, trimEnd);
        setProgress(100);
      } else {
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
      <audio ref={audioPlayerRef} preload="auto" className="hidden" />

      {/* Top Navbar */}
      <Header hasFile={Boolean(videoFile)} onReset={handleReset} />

      {/* Main Responsive Body */}
      <main className="flex-1 w-full flex flex-col justify-start">
        {!videoFile ? (
          <VideoPickerCard
            onFileSelect={handleSelectVideo}
            isLoading={isProcessing}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
            {/* Video Info Card */}
            <VideoPreviewCard
              file={videoFile}
              thumbnail={thumbnail?.dataUrl}
              duration={audioData?.duration || 0}
              onOpenMetadata={() => setIsMetadataOpen(true)}
            />

            {/* Waveform Trimmer */}
            {audioData && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-lg">
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
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Format Selector & Action Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2.5">
                  Output Format & Quality
                </label>
                <PillTabs
                  options={formatOptions}
                  selected={format}
                  onChange={setFormat}
                />
              </div>

              {isProcessing && (
                <ProgressBar percent={progress} statusText={statusText} />
              )}

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
