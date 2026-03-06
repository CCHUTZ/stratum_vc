# STRATUM Chat Panel Testing Guide

## Setup

1. **Get a Groq API Key**
   - Visit https://console.groq.com/
   - Create a free account (14,400 requests/day)
   - Generate an API key from the dashboard

2. **Configure Environment**
   ```bash
   # Copy .env.example to .env.local
   cp .env.example .env.local

   # Add your Groq API key
   # VITE_GROQ_API_KEY=<your-groq-api-key>
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing Checklist

### Basic Functionality
- [ ] StratumChatPanel appears in the left sidebar with "◈ STRATUM ANALYSIS" title
- [ ] Textarea accepts input
- [ ] ANALYZE button is clickable
- [ ] Ctrl+Enter (or Cmd+Enter on Mac) triggers analysis

### API Integration
- [ ] Button shows "ANALYZING..." state while fetching from Groq
- [ ] Response appears with six lens scores and analyses
- [ ] Provider badge shows "groq" (not "mock")
- [ ] Analysis completes within 5 seconds

### Six-Lens Framework
Each analysis should return all six lenses:
- [ ] **Sacred Identity** — Religious/sacred sites, identity markers
- [ ] **Demographic** — Population dynamics, migration, composition
- [ ] **Humiliation** — Historical grievances, trauma narratives
- [ ] **Religious Networks** — Transnational religious coordination
- [ ] **Civilizational** — Inter-civilizational friction and clash
- [ ] **Cognitive Warfare** — Narrative control, information warfare

Each lens should have:
- [ ] Score 1-10 displayed numerically
- [ ] Score bar visualization (width = score × 10%)
- [ ] 1-sentence analysis text

### Region Detection
Try these inputs and verify detected region:

| Input | Expected Region |
|-------|-----------------|
| "Israel-Hamas conflict in Gaza" | Israel/Palestine |
| "Indian election 2024 Modi victory" | India/South Asia |
| "Ukraine offensive against Russia" | Ukraine/Russia |
| "Taiwan strait tensions with China" | China/Taiwan |
| "Mexican cartel violence escalation" | Mexico |
| "Iran nuclear program developments" | Middle East |

- [ ] Region appears in "Input Analysis" section
- [ ] Detected region is geographically accurate

### Error Handling
- [ ] **Missing API key**: Panel shows fallback mock analysis with provider "mock"
- [ ] **API rate limit (429)**: Panel gracefully degrades to mock
- [ ] **Network error**: Panel shows error message in red warning box
- [ ] **Parsing failure**: Panel shows partial results or fallback

### UI/UX
- [ ] Result animations slide in smoothly
- [ ] Colors use STRATUM theme (deep navy #050d1a, accent #4a9eff)
- [ ] Scores and text are readable in dark mode
- [ ] No console errors in browser DevTools

## Test Cases

### Case 1: Geopolitical Hotspot Analysis
```
Input: "Ongoing Israel-Palestine conflict with increased military operations in Gaza"
Expected: Region=Israel/Palestine, six lens scores around 7-9 for conflict-related lenses
```

### Case 2: Regional Economic Tension
```
Input: "China imposing tariffs on US tech exports amid Taiwan strait tensions"
Expected: Region=China/Taiwan, high civilizational/cognitive warfare scores
```

### Case 3: Generic Global Analysis
```
Input: "Climate change impacts on global food security"
Expected: Region=Global, moderate scores across demographic and civilizational lenses
```

### Case 4: Mock Fallback (No API Key)
```
Unset VITE_GROQ_API_KEY in .env.local
Input: "Any geopolitical event"
Expected: All scores = 5, analysis text = "Analysis pending — API unavailable", provider = "mock"
```

## Performance Metrics

- **API Response Time**: < 3 seconds (typical for Groq llama-3.1-8b-instant)
- **Parsing Time**: < 100ms (regex-based extraction)
- **UI Render**: < 50ms (six-lens grid layout)
- **Total**: < 3.5 seconds end-to-end

## Troubleshooting

### Button doesn't respond
- **Check**: Event listeners attach after 150ms debounce in Panel.setContent()
- **Solution**: Verify setTimeout(150) wrapper in StratumChatPanel.render()

### No region detected
- **Check**: Input keywords against detectRegionFromInput() patterns
- **Solution**: Region detection is case-insensitive but pattern-based; ensure keywords match

### Scores are all 5 with "Analysis incomplete" message
- **Check**: API returned incomplete response or parsing regex failed
- **Solution**: Check Groq API response format; ensure system prompt generates exact format

### Provider shows "mock" instead of "groq"
- **Check**: VITE_GROQ_API_KEY environment variable
- **Solution**: Verify key is set, not expired, and has quota remaining

## Browser Compatibility
- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 15+
- ✓ Mobile browsers (tested on iOS Safari, Chrome Mobile)
