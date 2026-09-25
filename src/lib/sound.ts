/** Soft original site music. One shared player, so Sound off always reaches it. */

type Session = {
  ctx: AudioContext;
  master: GainNode;
  timer: number;
};

const KEY = "__sitewiseYardSound";

function live(): Session | null {
  const session = (globalThis as typeof globalThis & { [KEY]?: Session | null })[KEY];
  return session ?? null;
}

function hold(session: Session | null) {
  (globalThis as typeof globalThis & { [KEY]?: Session | null })[KEY] = session;
}

export function yardSoundOn(): boolean {
  const session = live();
  return Boolean(session && session.ctx.state !== "closed");
}

export function stopYardSound() {
  const session = live();
  hold(null);
  if (!session) return;
  window.clearInterval(session.timer);
  const now = session.ctx.currentTime;
  session.master.gain.cancelScheduledValues(now);
  session.master.gain.setValueAtTime(0, now);
  try {
    session.master.disconnect();
  } catch {
    /* already disconnected */
  }
  if (session.ctx.state !== "closed") void session.ctx.close();
}

export function startYardSound() {
  const existing = live();
  if (existing && existing.ctx.state !== "closed") {
    const now = existing.ctx.currentTime;
    existing.master.gain.cancelScheduledValues(now);
    existing.master.gain.setValueAtTime(0.2, now);
    void existing.ctx.resume();
    return;
  }

  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.2;
  master.connect(ctx.destination);

  const phrase = [392, 493.88, 587.33, 493.88, 440, 392, 440, 493.88, 587.33, 523.25, 493.88, 440, 392, 329.63, 392, 493.88];
  const chords = [
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [146.83, 220, 293.66],
    [196, 246.94, 392],
  ];

  function tone(freq: number, when: number, peak: number, length: number) {
    [1, 2].forEach((partial, index) => {
      const voice = ctx.createOscillator();
      const env = ctx.createGain();
      voice.type = "sine";
      voice.frequency.setValueAtTime(freq * partial, when);
      const level = peak * (index === 0 ? 1 : 0.18);
      env.gain.setValueAtTime(0.0001, when);
      env.gain.exponentialRampToValueAtTime(Math.max(level, 0.0001), when + 0.03);
      env.gain.exponentialRampToValueAtTime(0.0001, when + length);
      voice.connect(env);
      env.connect(master);
      voice.start(when);
      voice.stop(when + length + 0.02);
    });
  }

  let step = 0;
  const play = () => {
    const session = live();
    if (!session || session.ctx !== ctx || session.ctx.state === "closed") return;
    const when = ctx.currentTime + 0.02;
    tone(phrase[step % phrase.length], when, 0.11, 0.85);
    if (step % 4 === 0) {
      const chord = chords[Math.floor(step / 4) % chords.length];
      chord.forEach((freq) => tone(freq, when, 0.035, 1.7));
    }
    step += 1;
  };

  const timer = window.setInterval(play, 520);
  hold({ ctx, master, timer });
  play();
  void ctx.resume();
}
