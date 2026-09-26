"use client";

// Site-wide background music: "Harbor Lights", rendered from source by
// scripts/music/ (npm run assets:music). The provider sits in the root layout
// so the song survives client navigation, but it only plays while a
// <MusicControl> is mounted — every page with the shared Nav, never the
// landing — and never before the visitor's first click or key press. Browsers
// block audio until then anyway, and a slow fade-in after a gesture beats a
// blast on page load.
//
// Playback is Web Audio, not <audio loop>: the decoded buffer loops on the
// exact bar length, so the seam is sample-accurate whatever padding the codec
// added. Muting or hiding the tab fades out and suspends the context, which
// pauses the song where it was instead of restarting it.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TRACK = {
  // 48 bars at 84 BPM — see scripts/music/harbor-lights.mjs.
  loopSeconds: (48 * 4 * 60) / 84,
  sources: [
    { url: "/audio/harbor-lights.webm", type: 'audio/webm; codecs="opus"' },
    { url: "/audio/harbor-lights.m4a", type: 'audio/mp4; codecs="mp4a.40.2"' },
  ],
};

export const VOLUME_MIN = 1;
export const VOLUME_MAX = 100;
const DEFAULTS = { volume: 50, muted: false };
const STORAGE_KEY = "tusst:music";

// Slider → gain on a squared curve, so loudness follows the slider the way
// ears expect. The file is mastered near -15 LUFS; the default 50 lands
// ≈15 dB under that (≈ -30 LUFS): a background bed, not a foreground track.
const MAX_GAIN = 0.7;
const gainFor = (volume: number) => MAX_GAIN * (volume / VOLUME_MAX) ** 2;

const FADE_IN_FIRST = 1.2; // setTargetAtTime constant: ~4s to full on first start
const FADE = 0.12;

function clampVolume(v: number) {
  return Math.min(VOLUME_MAX, Math.max(VOLUME_MIN, Math.round(v)));
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<typeof DEFAULTS>;
    return {
      volume: typeof parsed.volume === "number" ? clampVolume(parsed.volume) : DEFAULTS.volume,
      muted: parsed.muted === true,
    };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: typeof DEFAULTS) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // private mode / blocked storage: the setting just won't stick
  }
}

// Leading samples the decoder kept from the encoder's priming (AAC does this
// in some browsers). The song itself never starts on silence, so the first
// audible sample is the true bar-1 downbeat.
function leadingSilence(buf: AudioBuffer) {
  const limit = Math.min(buf.length, Math.round(buf.sampleRate * 0.2));
  const chans = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
  for (let i = 0; i < limit; i++) {
    if (chans.some((ch) => Math.abs(ch[i]) > 1e-4)) return i / buf.sampleRate;
  }
  return 0;
}

class MusicEngine {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private buffer: Promise<AudioBuffer | null> | null = null;
  private source: AudioBufferSourceNode | null = null;
  private audible = false;
  private level = 0;
  private suspendTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * Create the context. Must run inside a user gesture: that is what lets
   * Safari/iOS resume it later. Resumed once here, then parked again unless
   * update() asks for sound within the grace period.
   */
  prime() {
    if (this.ctx) {
      if (this.audible && this.ctx.state !== "running") void this.ctx.resume().catch(() => {});
      return;
    }
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(this.ctx.destination);
    void this.ctx.resume().catch(() => {});
    this.parkSoon();
  }

  update(audible: boolean, level: number) {
    this.audible = audible;
    this.level = level;
    const { ctx, gain } = this;
    if (!ctx || !gain) return;
    clearTimeout(this.suspendTimer);
    if (audible) {
      if (ctx.state !== "running") void ctx.resume().catch(() => {});
      if (this.source) gain.gain.setTargetAtTime(level, ctx.currentTime, FADE);
      else void this.start();
    } else {
      gain.gain.setTargetAtTime(0, ctx.currentTime, FADE);
      this.parkSoon();
    }
  }

  // Suspend after the fade-out: pauses the song in place and frees the audio thread.
  private parkSoon() {
    clearTimeout(this.suspendTimer);
    this.suspendTimer = setTimeout(() => {
      const { ctx } = this;
      if (!this.audible && ctx?.state === "running") void ctx.suspend().catch(() => {});
    }, 600);
  }

  private async start() {
    this.buffer ??= this.load();
    const buf = await this.buffer;
    const { ctx, gain } = this;
    if (!buf || !ctx || !gain || this.source) return;
    const lead = leadingSilence(buf);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.loopStart = lead;
    src.loopEnd = Math.min(buf.duration, lead + TRACK.loopSeconds);
    src.connect(gain);
    src.start(0, lead);
    this.source = src;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    if (this.audible) gain.gain.setTargetAtTime(this.level, ctx.currentTime, FADE_IN_FIRST);
  }

  private async load(): Promise<AudioBuffer | null> {
    const probe = document.createElement("audio");
    for (const { url, type } of TRACK.sources) {
      if (!probe.canPlayType(type) || !this.ctx) continue;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        return await this.ctx.decodeAudioData(await res.arrayBuffer());
      } catch {
        // decoder refused this container — try the next one
      }
    }
    return null;
  }

  dispose() {
    clearTimeout(this.suspendTimer);
    void this.ctx?.close().catch(() => {});
  }
}

// One engine per page; its AudioContext only comes to life on the first gesture.
let engine: MusicEngine | null = null;
const getEngine = () => (engine ??= new MusicEngine());

export type MusicStatus = "idle" | "on" | "muted";

interface MusicContextValue {
  volume: number;
  muted: boolean;
  status: MusicStatus;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  /** Mount-scoped: music plays only while at least one control is registered. */
  register: () => () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

// Gestures on the toggle itself are handled by its click (so the first click
// on the speaker starts the music instead of muting it).
export const MUSIC_TOGGLE_ATTR = "data-music-toggle";

export function MusicProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const hydrated = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  // Not rendered anywhere, so reading the real value up front can't cause a
  // hydration mismatch; it keeps a tab opened in the background silent.
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const [controls, setControls] = useState(0);

  // localStorage is a browser-only external store, so hydration is an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSettings(loadSettings());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Skip the first pass: it still holds the defaults (see useIdeLayout).
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Any click/tap/key press counts as the gesture that lets audio start.
  useEffect(() => {
    const onGesture = (e: Event) => {
      if (e.target instanceof Element && e.target.closest(`[${MUSIC_TOGGLE_ATTR}]`)) return;
      getEngine().prime();
      setUnlocked(true);
    };
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("pointerdown", onGesture, opts);
    window.addEventListener("keydown", onGesture, opts);
    return () => {
      window.removeEventListener("pointerdown", onGesture, opts);
      window.removeEventListener("keydown", onGesture, opts);
    };
  }, []);

  const audible = unlocked && controls > 0 && visible && !settings.muted;
  useEffect(() => {
    getEngine().update(audible, gainFor(settings.volume));
  }, [audible, settings.volume]);

  useEffect(
    () => () => {
      engine?.dispose();
      engine = null;
    },
    [],
  );

  const setVolume = useCallback((v: number) => {
    // Dragging the slider while muted unmutes, like every media player.
    setSettings({ volume: clampVolume(v), muted: false });
  }, []);

  const toggleMute = useCallback(() => {
    // Runs inside the click, so it may create the AudioContext itself.
    getEngine().prime();
    if (!unlocked) {
      setUnlocked(true);
      setSettings((s) => ({ ...s, muted: false }));
      return;
    }
    setSettings((s) => ({ ...s, muted: !s.muted }));
  }, [unlocked]);

  // A Nav swap between route groups unmounts one control and mounts the next;
  // releasing late keeps that from fading the song out and back in.
  const register = useCallback(() => {
    setControls((n) => n + 1);
    return () => {
      setTimeout(() => setControls((n) => n - 1), 600);
    };
  }, []);

  const status: MusicStatus = settings.muted ? "muted" : unlocked ? "on" : "idle";

  const value = useMemo(
    () => ({ volume: settings.volume, muted: settings.muted, status, setVolume, toggleMute, register }),
    [settings, status, setVolume, toggleMute, register],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}
