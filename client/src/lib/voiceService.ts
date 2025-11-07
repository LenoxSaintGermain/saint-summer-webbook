/**
 * ElevenLabs Voice Service
 * Handles text-to-speech generation for character dialogue
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for characters (from ElevenLabs library)
export const VOICE_IDS = {
  saint: 'SOYHLrjzK2X1ezoPC6cr', // Harry - young male American
  summer: 'gmgxCAKYkPXOuFp1uuga', // Luna - young female American (excellent for audiobooks)
  jayden: 'IKne3meq5aSn9XLyUdCD', // Charlie - young male Australian
  ella: 'EXAVITQu4vr4xnSDxMaL', // Sarah - young female American
  max: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - young male American
  ava: 'cgSgspJ2msm6clMCkdW9', // Jessica - young female American
  narrator: 'gmgxCAKYkPXOuFp1uuga', // Luna - for environmental sounds/narrator
} as const;

// Audio cache to avoid regenerating the same speech
const audioCache = new Map<string, string>();

/**
 * Generate speech from text using ElevenLabs API
 * @param text - The text to convert to speech
 * @param voiceId - The ElevenLabs voice ID to use
 * @returns Audio blob URL
 */
export async function generateSpeech(
  text: string,
  voiceId: string
): Promise<string> {
  // Check cache first
  const cacheKey = `${voiceId}:${text}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
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
 * Get voice ID for a character name
 * @param characterName - Name of the character (lowercase)
 * @returns Voice ID for the character
 */
export function getVoiceIdForCharacter(characterName: string): string {
  const normalizedName = characterName.toLowerCase().trim();
  
  // Map character names to voice IDs
  if (normalizedName.includes('saint')) return VOICE_IDS.saint;
  if (normalizedName.includes('summer')) return VOICE_IDS.summer;
  if (normalizedName.includes('jayden')) return VOICE_IDS.jayden;
  if (normalizedName.includes('ella')) return VOICE_IDS.ella;
  if (normalizedName.includes('max')) return VOICE_IDS.max;
  if (normalizedName.includes('ava')) return VOICE_IDS.ava;
  
  // Default to narrator voice for environmental elements
  return VOICE_IDS.narrator;
}

/**
 * Preload audio for a character's dialogue
 * @param text - The text to preload
 * @param characterName - Name of the character
 */
export async function preloadCharacterSpeech(
  text: string,
  characterName: string
): Promise<void> {
  const voiceId = getVoiceIdForCharacter(characterName);
  await generateSpeech(text, voiceId);
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
  const voiceId = getVoiceIdForCharacter(characterName);
  const audioUrl = await generateSpeech(text, voiceId);
  
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
