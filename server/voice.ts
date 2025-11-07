/**
 * Voice generation backend proxy for ElevenLabs API
 * This keeps the API key secure on the server side
 */

import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('WARNING: ELEVENLABS_API_KEY is not set!');
} else {
  const maskedKey = `${ELEVENLABS_API_KEY.slice(0, 6)}...${ELEVENLABS_API_KEY.slice(-4)}`;
  console.log('ElevenLabs API Key loaded:', maskedKey);
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for characters (from actual ElevenLabs account)
const DEFAULT_VOICE_IDS = {
  saint: 'aL8uVX07RoHgtrWkiNKZ',
  summer: 'nIlXQoXUjAQXWj0n4aa6',
  jayden: 'bTUWaza2KXabgs1rYBOo',
  ella: 'EXAVITQu4vr4xnSDxMaL',
  max: '9WKYDcZ6iCiGGgOdWQym',
  ava: 'wKMBFFgS4vVCPNJ4H0i9',
  narrator: 'SOYHLrjzK2X1ezoPC6cr',
} as const;

const pickVoiceId = <K extends keyof typeof DEFAULT_VOICE_IDS>(
  key: K,
  envValue: string | undefined
): string => {
  const trimmed = envValue?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_VOICE_IDS[key];
};

const VOICE_IDS: Record<keyof typeof DEFAULT_VOICE_IDS, string> = {
  saint: pickVoiceId('saint', process.env.ELEVENLABS_VOICE_SAINT),
  summer: pickVoiceId('summer', process.env.ELEVENLABS_VOICE_SUMMER),
  jayden: pickVoiceId('jayden', process.env.ELEVENLABS_VOICE_JAYDEN),
  ella: pickVoiceId('ella', process.env.ELEVENLABS_VOICE_ELLA),
  max: pickVoiceId('max', process.env.ELEVENLABS_VOICE_MAX),
  ava: pickVoiceId('ava', process.env.ELEVENLABS_VOICE_AVA),
  narrator: pickVoiceId('narrator', process.env.ELEVENLABS_VOICE_NARRATOR),
};

const sanitizeCharacterName = (rawName: string) =>
  rawName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const tokenize = (normalized: string) =>
  new Set(normalized.split(/\s+/).filter((token) => token.length > 0));

const voiceMatchers: Array<{
  match: (normalized: string, tokens: Set<string>) => boolean;
  voice: keyof typeof VOICE_IDS;
}> = [
  {
    voice: 'saint',
    match: (_, tokens) => tokens.has('saint') || tokens.has('st'),
  },
  {
    voice: 'summer',
    match: (normalized) => normalized.includes('summer'),
  },
  {
    voice: 'jayden',
    match: (_, tokens) => tokens.has('jayden'),
  },
  {
    voice: 'ella',
    match: (_, tokens) => tokens.has('ella'),
  },
  {
    voice: 'max',
    match: (_, tokens) => tokens.has('max'),
  },
  {
    voice: 'ava',
    match: (_, tokens) => tokens.has('ava'),
  },
];

export const voiceRouter = router({
  /**
   * Generate speech from text using ElevenLabs API
   */
  generateSpeech: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(5000),
        characterName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, characterName } = input;

      // Get voice ID for character
      const normalizedName = sanitizeCharacterName(characterName);
      const tokens = tokenize(normalizedName);
      let voiceId: string = VOICE_IDS.narrator; // Default

      for (const { match, voice } of voiceMatchers) {
        if (match(normalizedName, tokens)) {
          voiceId = VOICE_IDS[voice];
          break;
        }
      }

      console.log('Making request to ElevenLabs with voice ID:', voiceId, 'for character:', characterName);
      console.log('API key present:', !!ELEVENLABS_API_KEY);
      if (ELEVENLABS_API_KEY) {
        console.log('API key preview:', `${ELEVENLABS_API_KEY.slice(0, 6)}...`);
      }

      try {
        const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY!,
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
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('ElevenLabs API error:', response.status, errorText);
          throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        // Get audio as buffer
        const audioBuffer = await response.arrayBuffer();
        
        // Convert to base64 for transmission
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return {
          audio: base64Audio,
          mimeType: 'audio/mpeg',
        };
      } catch (error) {
        console.error('Error generating speech:', error);
        throw error;
      }
    }),
});
