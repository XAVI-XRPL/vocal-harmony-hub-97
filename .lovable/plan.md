

# Remove Training Select Page and Navigate Directly to Library

## Overview

Simplify the user flow by removing the intermediate Training Select page and having the "Start Training" button on the Home page navigate directly to the Library page where users can browse and select training modules.

---

## Current Flow

```text
Home Page → [Start Training] → Training Select Page → Library or Training Mode
```

## New Flow

```text
Home Page → [Start Training] → Library Page (for training modules)
```

---

## Changes Required

### 1. Update Home Page Navigation

**File: `src/pages/Home.tsx`**

| Change | Details |
|--------|---------|
| Update `onClick` handler | Change from `navigate("/training-select")` to `navigate("/library")` |

### 2. Remove Training Select Route

**File: `src/App.tsx`**

| Change | Details |
|--------|---------|
| Remove import | Delete `import TrainingSelect from "./pages/TrainingSelect"` |
| Remove route | Delete `<Route path="/training-select" element={<TrainingSelect />} />` |

### 3. Delete Training Select Page

**File: `src/pages/TrainingSelect.tsx`**

| Action | Details |
|--------|---------|
| Delete file | Remove the entire TrainingSelect.tsx file |

---

## Files to Modify

| File | Action |
|------|--------|
| `src/pages/Home.tsx` | Change navigation target from `/training-select` to `/library` |
| `src/App.tsx` | Remove TrainingSelect import and route |
| `src/pages/TrainingSelect.tsx` | Delete file |

---

## Expected Result

- Clicking "Start Training" on the Home page goes directly to the Library
- The TrainingSelect page is completely removed
- Simpler, more direct user flow to access training content

