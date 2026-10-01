import { useEffect, useMemo, useRef, useState } from 'react';
import type { WorkspaceFile } from '../types';
import { localResultBlob } from '../resultMedia';
import { Button } from './BlueprintControls';

export function Artifact({ file, companions = [file], onDownload }: {
  file: WorkspaceFile; companions?: WorkspaceFile[]; onDownload?: (file: WorkspaceFile) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const blob = useMemo(() => localResultBlob(file), [file.data, file.mediaBlob, file.type]);
  const url = useMemo(() => blob ? URL.createObjectURL(blob) : '', [blob]);
  useEffect(() => { setError(''); return () => { if (url) URL.revokeObjectURL(url); }; }, [url]);
  if (!url) return <p>This result is saved in OMERO. Open it to retrieve its preview.</p>;
  return <figure className={zoomed ? 'artifact-zoomed' : ''}>
    <Button className="plot-zoom" onClick={() => setZoomed(value => !value)}>{zoomed ? 'Close full view' : 'Open full view'}</Button>
    {file.type === 'video/mp4' ? <>
      <video ref={video} src={url} controls preload="metadata" playsInline aria-label={file.name}
        onError={() => setError("This movie could not be played. You can still download the file.")} />
      {error && <p role="alert">{error}</p>}
      <div className="movie-controls">
        {file.movie && file.movie.fps > 0 && Number.isFinite(file.movie.fps) && <><Button onClick={() => { if (video.current) { video.current.pause(); video.current.currentTime = Math.max(0, video.current.currentTime - 1 / file.movie!.fps); } }}>Previous frame</Button>
          <Button onClick={() => { if (video.current) { video.current.pause(); video.current.currentTime = Math.min(video.current.duration, video.current.currentTime + 1 / file.movie!.fps); } }}>Next frame</Button></>}
        <label>Playback speed <select defaultValue="1" onChange={event => { if (video.current) video.current.playbackRate = Number(event.target.value); }}>
          {[0.25, 0.5, 1, 2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}</select></label>
        <label><input type="checkbox" onChange={event => { if (video.current) video.current.loop = event.target.checked; }} />Loop</label>
        {file.movie && <span>{file.movie.frameCount} frames · {file.movie.fps} FPS</span>}
      </div>
    </> : <img src={url} alt={file.name} onDoubleClick={() => setZoomed(true)} />}
    <figcaption>{file.name}<span className="plot-downloads">{companions.map(item => <Button key={item.id} onClick={() => {
      if (onDownload) { onDownload(item); return; }
      const content = localResultBlob(item);
      if (!content) return;
      const href = URL.createObjectURL(content), link = document.createElement('a');
      link.href = href; link.download = item.name; link.click(); setTimeout(() => URL.revokeObjectURL(href), 1000);
    }}>{item.name.split('.').at(-1)?.toUpperCase() || 'Download'}</Button>)}</span></figcaption>
  </figure>;
}
