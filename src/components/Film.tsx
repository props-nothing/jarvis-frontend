import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { film } from "../content";

/** Fetch and play only after a visitor chooses play or a chapter. Never auto-resume. */
export default function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const hide = () => { if (document.hidden) element.pause(); };
    document.addEventListener("visibilitychange", hide);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => !entry.isIntersecting)) element.pause();
    });
    observer?.observe(element);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);

  const play = (at?: number) => {
    const element = video.current;
    if (!element) return;
    if (!element.getAttribute("src")) {
      element.src = window.matchMedia("(min-width: 1100px)").matches
        ? "/media/jarvis-film.mp4" : "/media/jarvis-film-720.mp4";
    }
    if (at !== undefined) element.currentTime = at;
    setStarted(true);
    setFailed(false);
    element.play().catch(() => setFailed(true));
  };

  return (
    <div className="film">
      <div className="film__frame">
        <video
          ref={video}
          className="film__video"
          poster="/media/jarvis-film-poster.jpg"
          controls={started}
          playsInline
          preload="none"
          aria-label="JARVIS capability film"
          aria-describedby="film-disclosure"
          onError={() => setFailed(true)}
        />
        {!started && <button type="button" className="film__big" onClick={() => play()} aria-label="Play the film">
          <Play size={24} aria-hidden /><span>Watch it work <small>{film.durationSeconds} s</small></span>
        </button>}
      </div>
      {failed && <p role="status">The film could not play here. <a href="/media/jarvis-film.mp4">Open the MP4</a>.</p>}
      <p className="film__note" id="film-disclosure">{film.disclosure}</p>
      <details className="disclosure film__details">
        <summary>Browse the chapters</summary>
        <ol className="film__chapters" aria-label="Film chapters">
          {film.chapters.map((entry) => <li key={entry.label}>
            <button type="button" onClick={() => play(entry.at)}>
              <span className="film__n">{String(Math.floor(entry.at / 60)).padStart(2, "0")}:{String(entry.at % 60).padStart(2, "0")}</span>
              <strong>{entry.label}</strong>
              <small>{entry.detail}</small>
            </button>
          </li>)}
        </ol>
      </details>
    </div>
  );
}
