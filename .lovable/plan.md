
# Plan: Audio Encoding Shell Script

## Overview
Create a shell script at `scripts/encode-audio.sh` that automates the FFmpeg encoding workflow for new exercises, following the project's **mixdown-first loading strategy**.

---

## What the Script Will Do

1. **Encode mixdown** at 192kbps stereo AAC (`.m4a`) for high-quality initial playback
2. **Encode all stems** at 128kbps stereo AAC (`.m4a`) for bandwidth-efficient background loading
3. **Optional mono mode** for stems (further reduces file size by ~50%)
4. **Preserve originals** - outputs to a separate folder or alongside originals with new extension

---

## Script Location

```
scripts/
  encode-audio.sh       <-- NEW
```

---

## Usage Examples

```bash
# Encode a single exercise folder
./scripts/encode-audio.sh public/audio/my-new-exercise

# Encode with mono stems (smaller files)
./scripts/encode-audio.sh --mono-stems public/audio/my-new-exercise

# Dry-run to see what would be encoded
./scripts/encode-audio.sh --dry-run public/audio/my-new-exercise
```

---

## Technical Details

### Input Requirements
- Expects a folder containing:
  - `mixdown.wav` (or `master.wav` / `full-mix.wav`)
  - `stem-*.wav` files (or any other `.wav` files treated as stems)

### Output
- `mixdown.m4a` at 192kbps stereo
- `*.m4a` for each stem at 128kbps stereo (or mono with `--mono-stems`)

### FFmpeg Commands Used

```bash
# Mixdown (192kbps stereo)
ffmpeg -i mixdown.wav -c:a aac -b:a 192k -ac 2 mixdown.m4a

# Stems (128kbps stereo)
ffmpeg -i stem.wav -c:a aac -b:a 128k -ac 2 stem.m4a

# Stems (128kbps mono - optional)
ffmpeg -i stem.wav -c:a aac -b:a 128k -ac 1 stem.m4a
```

---

## Script Features

| Feature | Description |
|---------|-------------|
| Auto-detect mixdown | Looks for `mixdown.wav`, `master.wav`, or `full-mix.wav` |
| Skip existing | Won't re-encode if `.m4a` already exists (use `--force` to override) |
| Progress output | Shows encoding progress with file names |
| Error handling | Exits cleanly if FFmpeg not installed or files missing |
| Cross-platform | Works on macOS and Linux |

---

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/encode-audio.sh` | Main encoding script |
| `docs/audio-encoding.md` | Documentation for the encoding workflow (optional) |

---

## Implementation Notes

- The script will be POSIX-compatible (`#!/bin/bash`)
- Includes a help flag (`--help`) with usage instructions
- Will validate FFmpeg is installed before running
- Outputs colored terminal messages for clarity
