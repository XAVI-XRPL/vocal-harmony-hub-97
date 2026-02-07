

## Add Testify V2 Stems -- Batch 2 of 2

### Overview
Copy the final 5 uploaded `.aac` stems and update their database paths to complete the Testify V2 exercise (15 stems total).

### Files to Copy

| Uploaded File | Destination | DB Stem ID |
|---|---|---|
| BLAKELEY-First.aac | `public/audio/testify-v2/blakeley-first.aac` | testify-v2-blakeley-first |
| BLAKELEY-Second.aac | `public/audio/testify-v2/blakeley-second.aac` | testify-v2-blakeley-second |
| BLAKELEY-Third.aac | `public/audio/testify-v2/blakeley-third.aac` | testify-v2-blakeley-third |
| BLAKELEY-Fourth.aac | `public/audio/testify-v2/blakeley-fourth.aac` | testify-v2-blakeley-fourth |
| JUSTIN-Second.aac | `public/audio/testify-v2/justin-second.aac` | testify-v2-justin-second |

### Steps

1. **Copy 5 audio files** to `public/audio/testify-v2/` with clean filenames
2. **Update 5 DB stem paths** from `.mp3` to `.aac`

### Technical Details

```sql
UPDATE stems SET audio_path = '/audio/testify-v2/blakeley-first.aac' WHERE id = 'testify-v2-blakeley-first';
UPDATE stems SET audio_path = '/audio/testify-v2/blakeley-second.aac' WHERE id = 'testify-v2-blakeley-second';
UPDATE stems SET audio_path = '/audio/testify-v2/blakeley-third.aac' WHERE id = 'testify-v2-blakeley-third';
UPDATE stems SET audio_path = '/audio/testify-v2/blakeley-fourth.aac' WHERE id = 'testify-v2-blakeley-fourth';
UPDATE stems SET audio_path = '/audio/testify-v2/justin-second.aac' WHERE id = 'testify-v2-justin-second';
```

No code changes needed -- all 15 stems will now be `.aac` and the 3-tier grouping remains automatic via `useSongs.ts`.

