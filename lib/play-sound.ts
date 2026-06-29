const REMOVE_SOUND_SRC = "/popp2.mp3";
const ADD_WORKING_SOUND_SRC = "/working.mp3";

let removeSound: HTMLAudioElement | null = null;
let addWorkingSound: HTMLAudioElement | null = null;

function playCachedSound(
  getSound: () => HTMLAudioElement | null,
  setSound: (sound: HTMLAudioElement) => void,
  src: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const sound = getSound() ?? new Audio(src);
  if (!getSound()) {
    setSound(sound);
  }

  sound.currentTime = 0;
  void sound.play().catch(() => {
    // Browsers may block playback without a user gesture; click handler satisfies this.
  });
}

export function playRemoveSound() {
  playCachedSound(
    () => removeSound,
    (sound) => {
      removeSound = sound;
    },
    REMOVE_SOUND_SRC
  );
}

export function playAddWorkingSound() {
  playCachedSound(
    () => addWorkingSound,
    (sound) => {
      addWorkingSound = sound;
    },
    ADD_WORKING_SOUND_SRC
  );
}
