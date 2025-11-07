/**
 * ElevenLabs Voice Service (Frontend)
 * Handles text-to-speech generation for character dialogue via backend proxy
 */

// Audio cache to avoid regenerating the same speech
const audioCache = new Map<string, string>();

/**
 * Generate speech from text using backend ElevenLabs proxy
 * @param text - The text to convert to speech
 * @param characterName - Name of the character speaking
 * @returns Audio blob URL
 */
export async function generateSpeech(
  text: string,
  characterName: string
): Promise<string> {
  // Check cache first
  const cacheKey = `${characterName}:${text}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    // Call backend API directly
    const response = await fetch('/api/trpc/voice.generateSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        characterName,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Convert base64 audio to blob URL
    const audioBytes = Uint8Array.from(atob(result.audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBytes], { type: result.mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Cache the audio URL
    audioCache.set(cacheKey, audioUrl);

    return audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Play character speech
 * @param text - The text to speak
 * @param characterName - Name of the character
 * @returns Audio element that's playing
 */
export async function playCharacterSpeech(
  text: string,
  characterName: string
): Promise<HTMLAudioElement> {
  const audioUrl = await generateSpeech(text, characterName);
  
  const audio = new Audio(audioUrl);
  audio.play();
  
  return audio;
}

/**
 * Clear the audio cache (useful for memory management)
 */
export function clearAudioCache(): void {
  // Revoke all blob URLs to free memory
  audioCache.forEach((url) => {
    URL.revokeObjectURL(url);
  });
  audioCache.clear();
}
