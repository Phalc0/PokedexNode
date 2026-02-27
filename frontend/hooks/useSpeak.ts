import { useEffect, useState } from 'react';

export function useSpeak(text: string | undefined) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  const toggle = () => {
    if (!text) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;
    utter.pitch = 1.05;

    const frVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'));
    if (frVoice) utter.voice = frVoice;

    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return { speaking, toggle };
}