import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { film } from "../content";

/**
 * The capability film. Nothing is fetched until the section is near the viewport; it then plays muted and loops while
 * on screen, and pauses when it leaves. Reduced motion never autoplays. Pausing by hand is respected until the visitor
 * presses play again.
 */
export default function Film() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [chapter, setChapter] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof IntersectionObserver === "undefined") { setNear(true); return; }
    const loader = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setNear(true); loader.disconnect(); }
    }, { rootMargin: "600px 0px" });
    const viewer = new IntersectionObserver((entries) => {
      const element = video.current;
      if (!element) return;
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          if (!reduced.matches && !userPaused.current) element.play().catch(() => setPlaying(false));
        } else if (!element.paused) {
          element.pause();
        }
      }
    }, { threshold: [0, 0.4, 0.8] });
    loader.observe(node);
    viewer.observe(node);
    return () => { loader.disconnect(); viewer.disconnect(); };
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) { userPaused.current = false; element.play().catch(() => setPlaying(false)); }
    else { userPaused.current = true; element.pause(); }
  };
  const seek = (index: number) => {
    const element = video.current;
    if (!element) return;
    element.currentTime = film.chapters[index].at;
    userPaused.current = false;
    element.play().catch(() => setPlaying(false));
  };
  const onTime = () => {
    const element = video.current;
    if (!element) return;
    const t = element.currentTime;
    let current = -1;
    film.chapters.forEach((entry, index) => { if (t >= entry.at) current = index; });
    setChapter(current);
    setProgress(element.duration ? t / element.duration : 0);
  };

  return (
    <div className="film" data-reveal>
      <div className="film__frame" ref={frame}>
        <video
          ref={video}
          className="film__video"
          poster="/media/jarvis-film-poster.jpg"
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label="Film: JARVIS works through one request across the web, mail and calendar, files, memory, agents, schedules, an approval and voice"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={onTime}
        >
          {near ? <source src="/media/jarvis-film.mp4" type="video/mp4" media="(min-width: 1100px)" /> : null}
          {near ? <source src="/media/jarvis-film-720.mp4" type="video/mp4" onError={() => { setFailed(true); setPlaying(false); }} /> : null}
        </video>
        <span className="film__corner film__corner--tl" aria-hidden />
        <span className="film__corner film__corner--tr" aria-hidden />
        <span className="film__corner film__corner--bl" aria-hidden />
        <span className="film__corner film__corner--br" aria-hidden />
        {failed ? (
          <a className="film__big" href="/media/jarvis-film.mp4">
            <Play size={30} aria-hidden />
            <span>Open the film <small>MP4</small></span>
          </a>
        ) : !playing ? (
          <button type="button" className="film__big" onClick={toggle} aria-label="Play the film">
            <Play size={30} aria-hidden />
            <span>Watch it work <small>{film.durationSeconds} s</small></span>
          </button>
        ) : null}
        <div className="film__bar">
          <button type="button" className="icon-button" onClick={toggle}
            aria-label={playing ? "Pause the film" : "Play the film"} title={playing ? "Pause the film" : "Play the film"}>
            {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
          </button>
          <div className="film__progress" aria-hidden><span style={{ transform: `scaleX(${progress})` }} /></div>
          <button type="button" className="icon-button" onClick={() => setMuted(!muted)} aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"} title={muted ? "Turn sound on" : "Turn sound off"}>
            {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
          </button>
        </div>
      </div>
      <ol className="film__chapters" aria-label="Film chapters">
        {film.chapters.map((entry, index) => (
          <li key={entry.label}>
            <button type="button" className={index === chapter ? "is-current" : undefined} aria-current={index === chapter ? "step" : undefined}
              onClick={() => seek(index)}>
              <span className="film__n">{String(index + 1).padStart(2, "0")}</span>
              <strong>{entry.label}</strong>
              <small>{entry.detail}</small>
            </button>
          </li>
        ))}
      </ol>
      <p className="film__note">{film.disclosure}</p>
    </div>
  );
}
