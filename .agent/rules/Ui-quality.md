---
trigger: glob
globs: **/*.tsx, **/*.css
---


# ui-quality.md
Job: measurable quality bars for public and admin screens. Visual style is not covered here.

- Aim for WCAG 2.2 AA on public and admin screens. Call it a target. Never claim compliance from one automated score. Why: AA includes checks that tools cannot do.
- Make every interactive element usable by keyboard, with visible focus and a sensible order. Why: keyboard and assistive device users depend on it.
- Give every input a visible label. Link each error to its field and say what to fix. Why: unlabeled fields and vague errors cause abandoned forms.
- Make touch targets at least 44 by 44 CSS pixels. Why: most customers use phones, and WCAG's own minimum is smaller.
- Make layouts work from 320 CSS pixels wide with no sideways scrolling. Why: many customers use small, low-cost phones.
- Do not rely on colour alone. Keep contrast high enough to read. Write useful alt text. Give decorative images empty alt text. Why: this serves low-vision and colour-blind users.
- Keep everything the user typed when validation fails. Show one clear next step on every form. Why: losing input is the main cause of form abandonment.
- Design empty, loading, error, missing-image and slow-network states for every page and list. Leave no dead ends. Why: real networks and real data fail often.
- Aim for LCP of 2.5 seconds or less, INP of 200 milliseconds or less and CLS of 0.1 or less, at the 75th percentile of field data when it exists. Before launch, run mobile lab tests. Report lab and field results separately. Why: a lab score alone can mislead.
- Optimise images. Defer scripts that are not needed at first load. Do not autoplay large video. Why: these are the usual causes of slow mobile pages.
- Required tests: a keyboard-only walk through the main journey. A 320 pixel layout. A missing-image state. A throttled-network run. Why: these prove the rules above hold.