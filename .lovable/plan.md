
# Fix: Sequential Stem Loading to Prevent Memory Crashes

## Problem Summary
The app crashes when loading stems because all 9+ stems are fetched and decoded simultaneously:
- Each 4-minute stereo stem decodes to ~40MB of raw PCM audio
- 9 stems x 40MB = 360MB memory spike
- Mobile browsers run out of memory and crash

## Root Cause

In `src/services/webAudioEngine.ts`, both stem loading methods use `Promise.all()`:

```typescript
// loadStemsInBackground() - Line 740
const loadPromises = stems.map(async (stemConfig) => { ... });
await Promise.all(loadPromises);

// loadAllStems() - Line 862  
const loadPromises = stems.map(async (stemConfig) => { ... });
await Promise.all(loadPromises);
```

This fires 9+ fetch + decode operations at once, overwhelming memory.

## Solution

Replace parallel loading with sequential loading using `for...of` loops:
1. Load stems ONE AT A TIME
2. Add small delay between stems for garbage collection
3. Clear previous song's buffers before loading new song
4. Add progress tracking per stem

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/services/webAudioEngine.ts` | Replace `Promise.all` with sequential `for...of` loop in both loading methods |

---

## Implementation Details

### 1. Update `loadStemsInBackground()` (Lines 735-798)

Replace the parallel `Promise.all` pattern with sequential loading:

```typescript
private async loadStemsInBackground(stems: StemConfig[]): Promise<void> {
  if (!this.audioContext || !this.masterGainNode) {
    throw new Error('AudioContext not initialized');
  }
  
  const signal = this.abortController?.signal;
  
  // Load stems ONE AT A TIME (not in parallel!)
  for (const stemConfig of stems) {
    // Check if cancelled
    if (signal?.aborted) {
      console.log('[WebAudioEngine] Stem loading cancelled');
      return;
    }
    
    console.log(`[WebAudioEngine] Loading stem: ${stemConfig.name}`);
    
    try {
      // Create gain node for this stem
      const gainNode = this.audioContext!.createGain();
      gainNode.gain.value = 0; // Start muted - will fade in during crossfade
      gainNode.connect(this.masterGainNode!);
      
      // Initialize stem data
      const stemData: StemData = {
        id: stemConfig.id,
        name: stemConfig.name,
        buffer: null,
        sourceNode: null,
        gainNode,
        volume: 0.8,
        isMuted: false,
        isSolo: false,
      };
      this.stems.set(stemConfig.id, stemData);
      
      // Fetch audio file with progress tracking
      const response = await fetch(stemConfig.url, { signal });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Track download progress
      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];
      
      if (response.body) {
        const reader = response.body.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (signal?.aborted) return;
          
          chunks.push(value);
          receivedBytes += value.length;
          
          if (totalBytes > 0) {
            const progress = Math.round((receivedBytes / totalBytes) * 80);
            this.updateStemProgress(stemConfig.id, progress, false);
          }
        }
      } else {
        // Fallback if body streaming not supported
        const buffer = await response.arrayBuffer();
        chunks.push(new Uint8Array(buffer));
        receivedBytes = buffer.byteLength;
      }
      
      // Combine chunks
      const combined = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      
      if (signal?.aborted) return;
      
      // Decode audio data
      console.log(`[WebAudioEngine] Decoding stem: ${stemConfig.name}`);
      const audioBuffer = await this.audioContext!.decodeAudioData(combined.buffer.slice(0));
      
      stemData.buffer = audioBuffer;
      this.updateStemProgress(stemConfig.id, 100, true);
      
      console.log(`[WebAudioEngine] ✓ Loaded: ${stemConfig.name}`);
      
      // Small delay between stems for garbage collector
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('[WebAudioEngine] Stem loading aborted');
        return;
      }
      
      console.error(`[WebAudioEngine] ✗ Failed: ${stemConfig.name}`, error);
      this.updateStemProgress(stemConfig.id, 0, false, (error as Error).message);
      // Continue loading other stems even if one fails
    }
  }
  
  // Verify at least some stems loaded
  const loadedCount = Array.from(this.stems.values()).filter(s => s.buffer).length;
  if (loadedCount === 0) {
    throw new Error('No stems could be loaded');
  }
  
  this.updateState({ allStemsReady: true });
}
```

### 2. Update `loadAllStems()` (Lines 857-919)

Apply the same sequential pattern:

```typescript
private async loadAllStems(stems: StemConfig[]): Promise<void> {
  if (!this.audioContext || !this.masterGainNode) {
    throw new Error('AudioContext not initialized');
  }
  
  const signal = this.abortController?.signal;
  
  // Load stems ONE AT A TIME (not in parallel!)
  for (const stemConfig of stems) {
    if (signal?.aborted) {
      console.log('[WebAudioEngine] Stem loading cancelled');
      return;
    }
    
    console.log(`[WebAudioEngine] Loading stem: ${stemConfig.name}`);
    
    try {
      // Create gain node for this stem
      const gainNode = this.audioContext!.createGain();
      gainNode.connect(this.masterGainNode!);
      
      // Initialize stem data
      const stemData: StemData = {
        id: stemConfig.id,
        name: stemConfig.name,
        buffer: null,
        sourceNode: null,
        gainNode,
        volume: 0.8,
        isMuted: false,
        isSolo: false,
      };
      this.stems.set(stemConfig.id, stemData);
      
      // Fetch with progress tracking
      const response = await fetch(stemConfig.url, { signal });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Track download progress
      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];
      
      if (response.body) {
        const reader = response.body.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (signal?.aborted) return;
          
          chunks.push(value);
          receivedBytes += value.length;
          
          if (totalBytes > 0) {
            const progress = Math.round((receivedBytes / totalBytes) * 80);
            this.updateStemProgress(stemConfig.id, progress, false);
          }
        }
      } else {
        const buffer = await response.arrayBuffer();
        chunks.push(new Uint8Array(buffer));
        receivedBytes = buffer.byteLength;
      }
      
      // Combine chunks
      const combined = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      
      if (signal?.aborted) return;
      
      // Decode audio data
      console.log(`[WebAudioEngine] Decoding stem: ${stemConfig.name}`);
      const audioBuffer = await this.audioContext!.decodeAudioData(combined.buffer.slice(0));
      
      stemData.buffer = audioBuffer;
      this.updateStemProgress(stemConfig.id, 100, true);
      
      console.log(`[WebAudioEngine] ✓ Loaded: ${stemConfig.name}`);
      
      // Small delay for garbage collector
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('[WebAudioEngine] Stem loading aborted');
        return;
      }
      
      console.error(`[WebAudioEngine] ✗ Failed: ${stemConfig.name}`, error);
      this.updateStemProgress(stemConfig.id, 0, false, (error as Error).message);
    }
  }
  
  // Verify at least some stems loaded
  const loadedCount = Array.from(this.stems.values()).filter(s => s.buffer).length;
  if (loadedCount === 0) {
    throw new Error('No stems could be loaded');
  }
  
  this.updateState({ allStemsReady: true });
}
```

### 3. Clear Buffers in `loadSong()` (Lines 255-330)

Add memory cleanup before loading new song:

```typescript
async loadSong(config?: SongConfig): Promise<void> {
  const songConfig = config || this.currentSongConfig;
  if (!songConfig) {
    console.warn('No song config to load');
    return;
  }
  
  // Abort any pending loads
  this.abort();
  
  // Clear previous song's buffers to free memory
  if (config && config.songId !== this.currentSongId) {
    console.log('[WebAudioEngine] Clearing previous song buffers...');
    this.cleanup();
    this.currentSongId = config.songId;
    this.currentSongConfig = config;
    
    // Force garbage collection opportunity
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  // ... rest of method unchanged
}
```

---

## Memory Flow After Fix

```text
Before (CRASH):
  Load stem 1 ──┬──> 40MB
  Load stem 2 ──┼──> 40MB   ← All at once = 360MB spike
  ...          ──┼──> ...
  Load stem 9 ──┴──> 40MB

After (SAFE):
  Load stem 1 ──> 40MB ──> GC delay
                          ↓
  Load stem 2 ──────────> 40MB ──> GC delay
                                   ↓
  Load stem 3 ─────────────────> 40MB ──> ...
  
  (Memory stays ~80-120MB, never spikes to 360MB)
```

---

## Expected Console Output After Fix

```text
[WebAudioEngine] Loading stem: Drums
[WebAudioEngine] Decoding stem: Drums
[WebAudioEngine] ✓ Loaded: Drums
[WebAudioEngine] Loading stem: Bass
[WebAudioEngine] Decoding stem: Bass
[WebAudioEngine] ✓ Loaded: Bass
[WebAudioEngine] Loading stem: Guitar
...
```

Each stem loads completely before the next starts.

---

## Testing Checklist

After implementation:
1. Open browser DevTools → Performance/Memory tab
2. Watch memory usage as stems load
3. Memory should climb gradually (step by step), not spike all at once
4. Each stem should show "Loading..." then "✓" one at a time in console
5. App should NOT crash on mobile
6. All stems should eventually show as loaded
7. Play button should work after stems are ready

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Loading Pattern | Parallel (`Promise.all`) | Sequential (`for...of`) |
| Memory Spike | ~360MB at once | ~40-80MB gradual |
| Mobile Stability | Crashes | Stable |
| Load Time | Faster but crashes | Slightly slower but reliable |
