# Audio Encoding Workflow

This document describes the audio encoding workflow for RVMT exercises, following the **mixdown-first loading strategy**.

## Overview

RVMT uses a two-phase loading strategy for audio:

1. **Phase 1 (Instant)**: Load a pre-mixed "mixdown" file for immediate playback
2. **Phase 2 (Background)**: Load individual stems for full mixer control

This approach provides near-instant playback (1-2 seconds) while still enabling the full stem mixing experience.

## Encoding Specifications

| Track Type | Format | Bitrate | Channels | Purpose |
|------------|--------|---------|----------|---------|
| Mixdown | AAC (.m4a) | 192kbps | Stereo | High-quality initial playback |
| Stems | AAC (.m4a) | 128kbps | Stereo* | Background loading, mixer control |

*Stems can optionally be encoded as mono to reduce file size by ~50%.

## Using the Encoding Script

### Basic Usage

```bash
# Make the script executable (first time only)
chmod +x scripts/encode-audio.sh

# Encode an exercise folder
./scripts/encode-audio.sh public/audio/my-new-exercise
```

### Options

| Flag | Description |
|------|-------------|
| `--mono-stems` | Encode stems as mono (saves ~50% bandwidth) |
| `--force` | Re-encode even if output files exist |
| `--dry-run` | Preview what would be encoded |
| `--help` | Show usage information |

### Examples

```bash
# Preview what will be encoded
./scripts/encode-audio.sh --dry-run public/audio/testify-exercise

# Encode with mono stems (recommended for high stem counts)
./scripts/encode-audio.sh --mono-stems public/audio/my-exercise

# Force re-encode all files
./scripts/encode-audio.sh --force public/audio/my-exercise
```

## Input Folder Structure

The script expects a folder containing:

```
my-exercise/
├── mixdown.wav      # Pre-mixed master (or master.wav, full-mix.wav)
├── vocal.wav        # Stem
├── guitar.wav       # Stem
├── drums.wav        # Stem
└── ...
```

## Output

After encoding:

```
my-exercise/
├── mixdown.wav      # Original (preserved)
├── mixdown.m4a      # Encoded at 192kbps stereo
├── vocal.wav        # Original (preserved)
├── vocal.m4a        # Encoded at 128kbps
├── guitar.wav
├── guitar.m4a
├── drums.wav
├── drums.m4a
└── ...
```

## Why AAC/M4A?

We use AAC (.m4a) instead of MP3 because:

- **Better compression**: 20-30% smaller files at equivalent quality
- **Superior quality**: Cleaner sound at low bitrates
- **Native support**: Plays natively on iOS/Safari without transcoding
- **Modern codec**: Designed for streaming and mobile playback

## Mono vs Stereo Stems

For exercises with many stems (10+), consider using `--mono-stems`:

| Setting | File Size | Best For |
|---------|-----------|----------|
| Stereo | ~1MB/min | Lead vocals, stereo instruments |
| Mono | ~0.5MB/min | Background vocals, bass, simple parts |

The `--mono-stems` flag applies to all stems. For selective mono encoding, encode those stems manually with FFmpeg:

```bash
ffmpeg -i backing-vocals.wav -c:a aac -b:a 128k -ac 1 backing-vocals.m4a
```

## Manual FFmpeg Commands

If you need more control, use FFmpeg directly:

```bash
# Mixdown (192kbps stereo)
ffmpeg -i mixdown.wav -c:a aac -b:a 192k -ac 2 -movflags +faststart mixdown.m4a

# Stem (128kbps stereo)
ffmpeg -i stem.wav -c:a aac -b:a 128k -ac 2 -movflags +faststart stem.m4a

# Stem (128kbps mono)
ffmpeg -i stem.wav -c:a aac -b:a 128k -ac 1 -movflags +faststart stem.m4a
```

The `-movflags +faststart` flag optimizes the file for streaming playback.

## Database Integration

After encoding, update the `songs` and `stems` tables in the database:

1. Set `full_mix_url` on the song to point to the mixdown
2. Update each stem's `audio_path` to use `.m4a` extension

Example SQL:

```sql
-- Update song mixdown URL
UPDATE songs 
SET full_mix_url = '/audio/my-exercise/mixdown.m4a'
WHERE id = 'my-exercise';

-- Update stem paths
UPDATE stems 
SET audio_path = '/audio/my-exercise/vocal.m4a'
WHERE song_id = 'my-exercise' AND name = 'Vocal';
```

## Troubleshooting

### FFmpeg not found

Install FFmpeg:
- **macOS**: `brew install ffmpeg`
- **Ubuntu/Debian**: `sudo apt install ffmpeg`
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Files too large

1. Use `--mono-stems` for background/simple stems
2. Consider lower bitrate for non-critical stems (96kbps)
3. Ensure source WAVs aren't unnecessarily high sample rate (44.1kHz is sufficient)

### Playback issues on mobile

Ensure the `-movflags +faststart` flag is used (the script includes this automatically). This moves the file's metadata to the beginning, enabling faster streaming start.
