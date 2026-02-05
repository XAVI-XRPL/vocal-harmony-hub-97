#!/bin/bash
#
# encode-audio.sh
# Encode exercise audio files for the RVMT mixdown-first loading strategy
#
# Usage:
#   ./scripts/encode-audio.sh [OPTIONS] <exercise-folder>
#
# Options:
#   --mono-stems    Encode stems as mono (saves ~50% bandwidth)
#   --force         Re-encode even if output files exist
#   --dry-run       Show what would be encoded without doing it
#   --help          Show this help message
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
MONO_STEMS=false
FORCE=false
DRY_RUN=false

# Mixdown file patterns (in priority order)
MIXDOWN_PATTERNS=("mixdown.wav" "master.wav" "full-mix.wav")

# Encoding settings
MIXDOWN_BITRATE="192k"
STEM_BITRATE="128k"

print_help() {
    cat << EOF
${BLUE}RVMT Audio Encoding Script${NC}

Encodes exercise audio files for the mixdown-first loading strategy:
  • Mixdown at ${MIXDOWN_BITRATE} stereo AAC (.m4a) for high-quality initial playback
  • Stems at ${STEM_BITRATE} AAC (.m4a) for bandwidth-efficient background loading

${YELLOW}Usage:${NC}
  ./scripts/encode-audio.sh [OPTIONS] <exercise-folder>

${YELLOW}Options:${NC}
  --mono-stems    Encode stems as mono (saves ~50% bandwidth)
  --force         Re-encode even if output files exist
  --dry-run       Show what would be encoded without doing it
  --help          Show this help message

${YELLOW}Examples:${NC}
  # Encode a single exercise folder
  ./scripts/encode-audio.sh public/audio/my-new-exercise

  # Encode with mono stems (smaller files)
  ./scripts/encode-audio.sh --mono-stems public/audio/my-new-exercise

  # Dry-run to see what would be encoded
  ./scripts/encode-audio.sh --dry-run public/audio/my-new-exercise

${YELLOW}Input Requirements:${NC}
  The folder should contain:
  • mixdown.wav (or master.wav / full-mix.wav) - the pre-mixed master
  • *.wav files for individual stems

${YELLOW}Output:${NC}
  • mixdown.m4a at ${MIXDOWN_BITRATE} stereo
  • *.m4a for each stem at ${STEM_BITRATE} (stereo or mono with --mono-stems)

EOF
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

check_ffmpeg() {
    if ! command -v ffmpeg &> /dev/null; then
        log_error "FFmpeg is not installed. Please install it first:"
        echo "  macOS:  brew install ffmpeg"
        echo "  Ubuntu: sudo apt install ffmpeg"
        exit 1
    fi
}

find_mixdown() {
    local folder="$1"
    for pattern in "${MIXDOWN_PATTERNS[@]}"; do
        if [[ -f "$folder/$pattern" ]]; then
            echo "$folder/$pattern"
            return 0
        fi
    done
    return 1
}

encode_file() {
    local input="$1"
    local output="$2"
    local bitrate="$3"
    local channels="$4"
    local label="$5"

    local basename_in=$(basename "$input")
    local basename_out=$(basename "$output")

    # Check if output exists and --force not set
    if [[ -f "$output" ]] && [[ "$FORCE" == "false" ]]; then
        log_warning "Skipping $basename_out (exists, use --force to override)"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY-RUN] Would encode: $basename_in → $basename_out (${bitrate}, ${channels}ch)"
        return 0
    fi

    log_info "Encoding $label: $basename_in → $basename_out"
    
    ffmpeg -y -i "$input" \
        -c:a aac \
        -b:a "$bitrate" \
        -ac "$channels" \
        -movflags +faststart \
        "$output" \
        -loglevel warning

    log_success "Encoded: $basename_out"
}

main() {
    local folder=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --mono-stems)
                MONO_STEMS=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --help|-h)
                print_help
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
            *)
                folder="$1"
                shift
                ;;
        esac
    done

    # Validate folder argument
    if [[ -z "$folder" ]]; then
        log_error "No exercise folder specified"
        echo "Usage: ./scripts/encode-audio.sh [OPTIONS] <exercise-folder>"
        echo "Use --help for more information"
        exit 1
    fi

    if [[ ! -d "$folder" ]]; then
        log_error "Folder does not exist: $folder"
        exit 1
    fi

    # Check FFmpeg
    check_ffmpeg

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  RVMT Audio Encoder${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    log_info "Folder: $folder"
    log_info "Mono stems: $MONO_STEMS"
    log_info "Force: $FORCE"
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "DRY-RUN MODE - No files will be encoded"
    fi
    echo ""

    local stem_channels=2
    if [[ "$MONO_STEMS" == "true" ]]; then
        stem_channels=1
    fi

    local mixdown_count=0
    local stem_count=0

    # Find and encode mixdown
    if mixdown_file=$(find_mixdown "$folder"); then
        local mixdown_basename=$(basename "$mixdown_file" .wav)
        local mixdown_output="$folder/${mixdown_basename}.m4a"
        encode_file "$mixdown_file" "$mixdown_output" "$MIXDOWN_BITRATE" 2 "mixdown"
        ((mixdown_count++))
    else
        log_warning "No mixdown found (looked for: ${MIXDOWN_PATTERNS[*]})"
    fi

    # Encode all other WAV files as stems
    for wav_file in "$folder"/*.wav; do
        [[ -f "$wav_file" ]] || continue
        
        local basename=$(basename "$wav_file" .wav)
        
        # Skip if this is the mixdown
        for pattern in "${MIXDOWN_PATTERNS[@]}"; do
            if [[ "$basename.wav" == "$pattern" ]]; then
                continue 2
            fi
        done

        local output="$folder/${basename}.m4a"
        encode_file "$wav_file" "$output" "$STEM_BITRATE" "$stem_channels" "stem"
        ((stem_count++))
    done

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would encode: $mixdown_count mixdown(s), $stem_count stem(s)"
    else
        log_success "Complete: $mixdown_count mixdown(s), $stem_count stem(s)"
    fi
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

main "$@"
