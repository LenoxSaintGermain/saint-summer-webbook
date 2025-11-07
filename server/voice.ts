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
const VOICE_IDS = {
  saint: 'aL8uVX07RoHgtrWkiNKZ',
  summer: 'nIlXQoXUjAQXWj0n4aa6',
  jayden: 'bTUWaza2KXabgs1rYBOo',
  ella: 'EXAVITQu4vr4xnSDxMaL',
  max: '9WKYDcZ6iCiGGgOdWQym',
  ava: 'wKMBFFgS4vVCPNJ4H0i9',
  narrator: 'SOYHLrjzK2X1ezoPC6cr',
} as const;

type VoiceKey = keyof typeof VOICE_IDS;

const VOICE_ENV_OVERRIDES: Record<VoiceKey, string | undefined> = {
  saint: process.env.ELEVENLABS_VOICE_SAINT,
  summer: process.env.ELEVENLABS_VOICE_SUMMER,
  jayden: process.env.ELEVENLABS_VOICE_JAYDEN,
  ella: process.env.ELEVENLABS_VOICE_ELLA,
  max: process.env.ELEVENLABS_VOICE_MAX,
  ava: process.env.ELEVENLABS_VOICE_AVA,
  narrator: process.env.ELEVENLABS_VOICE_NARRATOR,
};

// Allow per-character overrides via environment variables while falling back to defaults.
const RESOLVED_VOICE_IDS = (Object.keys(VOICE_IDS) as VoiceKey[]).reduce(
  (acc, key) => {
    const override = VOICE_ENV_OVERRIDES[key]?.trim();
    acc[key] = override && override.length > 0 ? override : VOICE_IDS[key];
    return acc;
  },
  {} as Record<VoiceKey, string>
);

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
  voice: VoiceKey;
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
      let voiceId: string = RESOLVED_VOICE_IDS.narrator; // Default

      for (const { match, voice } of voiceMatchers) {
        if (match(normalizedName, tokens)) {
          voiceId = RESOLVED_VOICE_IDS[voice];
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
