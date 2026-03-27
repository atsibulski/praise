---
name: mobbin-research
description: Collect UI/UX references from Mobbin for a mobile app idea and generate a unique design foundation. Use this skill when the user says "collect references on Mobbin", "research Mobbin for my app", "find references for [app idea]", "gather Mobbin references", or any variation of wanting to gather mobile UI inspiration. The skill browses Mobbin using the logged-in browser profile, collects screenshots for key app screens, analyzes patterns, and outputs design tokens + a visual identity brief that Claude Code uses to build a unique, non-generic app design. Mobile apps only (iOS / Android / React Native / SwiftUI / Flutter).
---
 
# Mobbin Research Skill
 
Researches Mobbin.com for a specific mobile app idea, collects screenshots of relevant screens, and synthesizes everything into a design foundation that drives unique, high-quality UI generation — not generic AI output.
 
## Trigger phrases
- "collect references on Mobbin for [app idea]"
- "research Mobbin for my app [description]"
- "find Mobbin references for [screen list]"
- "gather Mobbin references for [app]"
 
---
 
## Step 1 — Understand the app idea
 
Before opening the browser, extract from the user's message:
 
| What to capture | If not mentioned, ask |
|---|---|
| App idea / concept | Required — ask if missing |
| Key screens (5–10) | Suggest defaults based on app type if not given |
| App category | Infer from idea, confirm if unclear |
| Stack | React Native / SwiftUI / Flutter — ask if not obvious |
| Save location | Default: `./references/mobbin/` |
 
**Suggest default screens based on app type if user didn't list them:**
- Social app → onboarding, feed, profile, post detail, notifications, DMs
- Fintech → onboarding, dashboard, transaction list, send money, card detail
- Health/fitness → onboarding, home dashboard, activity log, progress, settings
- Marketplace → browse/discovery, product detail, cart, checkout, orders
- Productivity → onboarding, home/inbox, task detail, create flow, settings
 
Once scope is clear, proceed immediately — don't over-ask.
 
---
 
## Step 2 — Search Mobbin by screen
 
Open `https://mobbin.com` using the browser tool. The user must already be logged in — if a login wall appears, stop and tell the user.
 
Read `references/mobbin-navigation.md` for URL patterns and search keywords.
 
### Search strategy
 
For **each key screen** the user mentioned (or the defaults):
1. Search for that screen type: `"onboarding"`, `"home feed"`, `"transaction history"`, etc.
2. Apply the app category filter to narrow results
3. Sort by **Popular**
4. Pick **2–3 best screenshots** for this screen type from **different apps**
 
Goal: cover every key screen with at least 2 references from different apps.
 
### Diversity rules
- Collect from **6–10 different apps** total
- Max **3 screenshots per app** across all screens
- Prefer well-known, well-designed apps (Airbnb, Stripe, Duolingo, Robinhood, Linear, etc.)
- Mix dark and light themes if possible
 
---
 
## Step 3 — Screenshot each screen
 
For every selected screen:
1. Click to open full-size view on Mobbin
2. Screenshot using the browser tool
3. Save to `./references/mobbin/{screen_type}/{app_name}.png`
   - Example: `./references/mobbin/onboarding/duolingo.png`
4. Log: app name, screen type, theme (light/dark), notable quality
 
**Target: 15–25 screenshots total**, organized by screen type folder.
 
---
 
## Step 4 — Analyze for design patterns
 
After collection, analyze all screenshots **as a batch**. Read `references/analysis-template.md` for the full per-screen checklist.
 
### Extract across all screens:
 
**Visual language**
- Dominant color temperature (warm / neutral / cool)
- Light vs dark skew
- Overall density (airy / balanced / dense)
- Corner radius personality (sharp / soft / very rounded)
- Shadow usage (flat / subtle / dramatic)
 
**Color patterns**
- Most common background approach
- How brand color is used (sparingly as accent vs dominantly)
- Text color hierarchy (how many levels, typical values)
- How interactive elements (CTAs, links) are distinguished
 
**Spacing patterns**
- Typical screen horizontal padding
- Card internal padding
- Vertical rhythm between sections
- List item height and spacing
 
**Typography patterns**
- Heading weight and size relative to screen
- Body text size and line height
- How many type scales are used
- Any distinctive typographic choices
 
**Component patterns** (note what's most common)
- Navigation: tab bar / top nav / gesture-only
- Cards: elevated with shadow / outlined / flat with divider
- Primary CTA: full-width bottom / floating / inline
- Inputs: outlined / filled / minimal underline
- Modals/sheets: bottom sheet / centered / full-screen
 
---
 
## Step 5 — Generate design foundation artifacts
 
### 5a. Design direction brief
 
Save as `./references/mobbin/design-brief.md`
 
This is the most important artifact — it tells Claude Code *how to design*, not just what tokens to use.
 
```markdown
# Design Brief — [App Name]
 
## App concept
[One sentence description]
 
## Key screens to build
[List from user input]
 
## Design direction
[A clear aesthetic direction synthesized from references — e.g.:
"Clean, trust-building fintech aesthetic: off-white surfaces, 
one strong brand color used sparingly, generous whitespace, 
heavy typography for numbers, minimal decorative elements"]
 
## What makes this design unique
[2–3 deliberate choices that will prevent generic output — e.g.:
- Use large, confident typography for primary values/numbers
- Avoid purple gradients and standard blue — use [specific direction] instead  
- Cards are flat with hairline borders, no shadows]
 
## Reference apps to draw inspiration from
| App | What to borrow |
|-----|----------------|
| [App] | [Specific quality — e.g. "typography hierarchy"] |
| [App] | [Specific quality — e.g. "spacing and whitespace"] |
| [App] | [Specific quality — e.g. "CTA button style"] |
 
## Anti-patterns to avoid
- [Generic AI clichés observed in references to actively avoid]
- [e.g. "purple gradients", "over-rounded everything", "floating cards with heavy shadow"]
 
## Screenshot references by screen
| Screen | Reference files |
|--------|----------------|
| Onboarding | references/mobbin/onboarding/*.png |
| Home | references/mobbin/home/*.png |
| ... | ... |
```
 
### 5b. Design tokens
 
Based on patterns, generate opinionated tokens — not generic defaults.
 
**React Native** → `./references/mobbin/tokens.ts`:
```typescript
// Design tokens — synthesized from Mobbin research
// Source: references/mobbin/design-brief.md
 
export const tokens = {
  colors: {
    background: '',      // main screen background
    surface: '',         // cards, sheets
    surfaceElevated: '', // modals, popovers
    primary: '',         // brand / CTA
    primaryForeground: '',
    secondary: '',       // secondary actions
    textPrimary: '',
    textSecondary: '',
    textDisabled: '',
    border: '',
    borderSubtle: '',
    error: '',
    success: '',
  },
  spacing: {
    screenEdge: 0,   // horizontal padding
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 0,    // tags, chips
    md: 0,    // inputs, buttons
    lg: 0,    // cards
    xl: 0,    // modals, sheets
    pill: 999,
  },
  typography: {
    displayLg: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    displayMd: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    headingLg: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    headingMd: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    body: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    bodySmall: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    caption: { fontSize: 0, fontWeight: '', lineHeight: 0 },
    label: { fontSize: 0, fontWeight: '', lineHeight: 0 },
  },
  shadows: {
    card: {},
    modal: {},
    button: {},
  },
} as const;
```
 
**SwiftUI** → `./references/mobbin/DesignTokens.swift`
**Flutter** → `./references/mobbin/design_tokens.dart`
 
Fill all values with actual extracted values — no placeholders in the final file.
 
### 5c. Screenshot index
 
Save as `./references/mobbin/index.md`:
 
```markdown
# Screenshot Index
 
## onboarding/
- duolingo.png — animated mascot, full-screen illustration, single CTA bottom
- robinhood.png — dark theme, bold headline, minimal copy
 
## home/
...
 
## [screen_type]/
...
```
 
---
 
## Step 6 — Write CLAUDE.md block
 
Append (or create) a design context section in `CLAUDE.md`:
 
```markdown
## Design References
 
Mobbin research is in `references/mobbin/`. Always use it when building UI.
 
Before building any screen:
1. Read `references/mobbin/design-brief.md` — design direction, what makes this unique, what to avoid
2. Import `references/mobbin/tokens.ts` — all colors, spacing, typography, radius values
3. Check `references/mobbin/index.md` and view relevant screenshots for the screen you're building
4. Follow the "What makes this design unique" and "Anti-patterns to avoid" sections strictly
 
Do not invent colors, spacing, or component styles. Derive everything from tokens and brief.
Screenshots in references/mobbin/ are the ground truth for visual decisions.
```
 
---
 
## Step 7 — Summary to user
 
```
✅ Mobbin research complete for [App Name]
 
📱 Apps researched: [list]
🖼  Screenshots: [count] → references/mobbin/[screen]/
🎨 Tokens: references/mobbin/tokens.ts
📋 Design brief: references/mobbin/design-brief.md
🗺  Index: references/mobbin/index.md
📄 CLAUDE.md: updated
 
Design direction:
"[One sentence from the brief]"
 
What makes this design unique:
• [Choice 1]
• [Choice 2]
• [Choice 3]
 
Next: ask Claude Code to build any screen — it will reference these files automatically.
```
 
---
 
## Rules
 
- **Mobile only** — iOS / Android / React Native / SwiftUI / Flutter. Not web.
- **Never log in** — if Mobbin shows a login wall, stop and tell the user.
- **Design brief is the most valuable artifact** — be opinionated, not generic.
- **Tokens are visual estimates** — extracted by eye, not from source. Add `// estimated` comments.
- **Unique ≠ weird** — quality and distinctiveness, not novelty for its own sake.
- **Diversity of sources** — never pull more than 3 screens from a single app.