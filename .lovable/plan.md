

## Add Testify V2 Stems (Batch 1 of 2) and Unlock for Demo

### Overview
Replace existing testify-v2 `.mp3` stems with new `.aac` versions, add a new Keys (Piano/Rhodes) stem, and unlock the exercise for demo mode users. The 3-tiered stem grouping (Core Vocals / Instruments / Harmonies) is already handled automatically by `useSongs.ts` based on stem `type`.

### Batch 1: 9 Stems (this round)

| Uploaded File | Stem Name | Type | DB ID | Position |
|---|---|---|---|---|
| ACAPELLA.aac | Acapella (Master) | vocal | testify-v2-acapella | 0 |
| JUSTIN-First.aac | Justin First | vocal | testify-v2-justin-first | 5 |
| RAab-1.aac | RAab First | vocal | testify-v2-raab-first | 10 |
| INSTR.aac | Instrumental | instrumental | testify-v2-instrumental | 13 |
| KEYS-PianoRhodes.aac | Piano/Rhodes | keys | testify-v2-keys (NEW) | 14 |
| RAab-Second.aac | RAab Second | harmony | testify-v2-raab-second | 8 |
| RAab-Third.aac | RAab Third | harmony | testify-v2-raab-third | 12 |
| RAab-Fourth.aac | RAab Fourth | harmony | testify-v2-raab-fourth | 9 |
| JUSTIN-Third.aac | Justin Third | harmony | testify-v2-justin-third | 7 |

Skipped: `JUSTIN-First_1.aac` (duplicate)

### Batch 2: 5 Stems (next upload)
Blakeley First, Blakeley Second, Blakeley Third, Blakeley Fourth, Justin Second (to be confirmed when uploaded).

### 3-Tier Grouping (automatic via useSongs.ts)
- **Core Vocals (Immediate)**: vocal + instrumental types -- Acapella, Justin First, RAab First, Blakeley First, Instrumental
- **Instruments (Lazy)**: keys type -- Piano/Rhodes
- **Harmonies (Lazy)**: harmony types -- all Second/Third/Fourth parts + Justin Third

### Steps

1. **Copy 9 audio files** to `public/audio/testify-v2/` with clean filenames:
   - `acapella.aac`, `instrumental.aac`, `keys-pianorhodes.aac`, `justin-first.aac`, `justin-third.aac`, `raab-first.aac`, `raab-second.aac`, `raab-third.aac`, `raab-fourth.aac`

2. **Update database stems** -- change `audio_path` from `.mp3` to `.aac` for the 8 existing stems, and INSERT 1 new Keys stem

3. **Unlock for demo mode** -- UPDATE `songs` SET `is_premium = false` WHERE `id = 'testify-v2'`

4. **No code changes needed** -- `useSongs.ts` already auto-partitions stems into the 3-tier groups based on `type`, and `SongCard`/`SongDetail` already check `isPremium` for locking

### Technical Details

```sql
-- Update existing stems to .aac paths
UPDATE stems SET audio_path = '/audio/testify-v2/acapella.aac' WHERE id = 'testify-v2-acapella';
UPDATE stems SET audio_path = '/audio/testify-v2/instrumental.aac' WHERE id = 'testify-v2-instrumental';
UPDATE stems SET audio_path = '/audio/testify-v2/justin-first.aac' WHERE id = 'testify-v2-justin-first';
UPDATE stems SET audio_path = '/audio/testify-v2/justin-third.aac' WHERE id = 'testify-v2-justin-third';
UPDATE stems SET audio_path = '/audio/testify-v2/raab-first.aac' WHERE id = 'testify-v2-raab-first';
UPDATE stems SET audio_path = '/audio/testify-v2/raab-second.aac' WHERE id = 'testify-v2-raab-second';
UPDATE stems SET audio_path = '/audio/testify-v2/raab-third.aac' WHERE id = 'testify-v2-raab-third';
UPDATE stems SET audio_path = '/audio/testify-v2/raab-fourth.aac' WHERE id = 'testify-v2-raab-fourth';

-- Insert new Keys stem
INSERT INTO stems (id, song_id, name, type, audio_path, color, position)
VALUES ('testify-v2-keys', 'testify-v2', 'Piano/Rhodes', 'keys', '/audio/testify-v2/keys-pianorhodes.aac', '#10b981', 14);

-- Unlock for demo mode
UPDATE songs SET is_premium = false WHERE id = 'testify-v2';
```
