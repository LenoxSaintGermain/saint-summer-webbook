/**
 * Voice generation backend proxy for ElevenLabs API
 * This keeps the API key secure on the server side
 */

import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for characters
const VOICE_IDS = {
  saint: 'SOYHLrjzK2X1ezoPC6cr', // Harry - young male American
  summer: 'gmgxCAKYkPXOuFp1uuga', // Luna - young female American (excellent for audiobooks)
  jayden: 'IKne3meq5aSn9XLyUdCD', // Charlie - young male Australian
  ella: 'EXAVITQu4vr4xnSDxMaL', // Sarah - young female American
  max: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - young male American
  ava: 'cgSgspJ2msm6clMCkdW9', // Jessica - young female American
  narrator: 'gmgxCAKYkPXOuFp1uuga', // Luna - for environmental sounds/narrator
} as const;

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
      const normalizedName = characterName.toLowerCase().trim();
      let voiceId: string = VOICE_IDS.narrator; // Default

      if (normalizedName.includes('saint')) voiceId = VOICE_IDS.saint;
      else if (normalizedName.includes('summer')) voiceId = VOICE_IDS.summer;
      else if (normalizedName.includes('jayden')) voiceId = VOICE_IDS.jayden;
      else if (normalizedName.includes('ella')) voiceId = VOICE_IDS.ella;
      else if (normalizedName.includes('max')) voiceId = VOICE_IDS.max;
      else if (normalizedName.includes('ava')) voiceId = VOICE_IDS.ava;

      try {
        const response = await fetch(
          `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
          {
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
          }
        );

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
