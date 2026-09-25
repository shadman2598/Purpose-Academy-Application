import { useProgress } from "../state/progress";
import { startYardSound, stopYardSound } from "../lib/sound";

export function SoundToggle() {
  const { state, updateSettings } = useProgress();
  const on = state.settings.sound !== false;

  function toggle() {
    const next = !on;
    updateSettings({ sound: next });
    if (next) startYardSound();
    else stopYardSound();
  }

  return (
    <button type="button" className={on ? "sound-toggle on" : "sound-toggle"} aria-pressed={on} onClick={toggle}>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
