
# Always Navigate to Home Dashboard After Splash Screen

## Problem

When the app loads and the splash screen finishes, the app currently preserves whatever URL was in the browser. This means:
- If a user refreshes while on `/training/testify-exercise`, they go back to that training page
- If a user bookmarks a deep link and returns, they skip the home dashboard
- The intended flow (splash → home dashboard) isn't enforced

## Solution

After the splash screen completes, programmatically navigate to the home route (`/`) to ensure users always start from the dashboard.

---

## Implementation

### Modify App.tsx

Add navigation to home after splash completes using `useNavigate`:

**Current Flow:**
```
Splash → (preserve current URL) → Show page at that URL
```

**New Flow:**
```
Splash → Navigate to "/" → Home Dashboard
```

### Technical Approach

Since `BrowserRouter` is rendered only after splash/onboarding, we need to structure the navigation carefully:

1. Move `BrowserRouter` to wrap the entire app (including splash/onboarding states)
2. Add a navigation effect that runs when splash completes to redirect to home
3. Use `useNavigate` hook inside a component that's within the router context

```tsx
function AppRoutes() {
  const navigate = useNavigate();
  const [hasNavigatedHome, setHasNavigatedHome] = useState(false);

  useEffect(() => {
    // Navigate to home once after splash completes
    if (!hasNavigatedHome) {
      navigate("/", { replace: true });
      setHasNavigatedHome(true);
    }
  }, [navigate, hasNavigatedHome]);

  return (
    <Routes>
      {/* ... existing routes ... */}
    </Routes>
  );
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Restructure to navigate to home after splash completes |

---

## Expected Behavior

| Scenario | Before | After |
|----------|--------|-------|
| Fresh load | Shows splash → stays on current URL | Shows splash → navigates to home |
| Refresh on training page | Returns to training page | Shows splash → navigates to home |
| Deep link to `/library` | Goes directly to library | Shows splash → navigates to home |
| Normal navigation within app | Works normally | Works normally (no redirect) |

The navigation to home only happens once when the app first loads and the splash completes - subsequent in-app navigation works as expected.
