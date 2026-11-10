# Mohamed & Hania — Wedding Invitation

Digital invitation for the wedding of **Mohamed & Hania**
Friday 27 November 2026 · 7:00 PM · The Nile Ballroom, Sofitel Cairo Downtown Nile.

Plain static site (HTML/CSS/JS, no build step), deployed on Vercel.

## Structure
```
index.html            page markup (all sections)
css/style.css         design system + layout + animations
css/fonts.css         self-hosted fonts (Cormorant Garamond, Jost, Pinyon Script, Amiri, Aref Ruqaa)
js/main.js            envelope opening, gold-dust canvas, countdown, music, calendar, share
assets/venue.jpg      Sofitel photo (arch window)   ·  assets/venue-blur.jpg  blurred background
assets/og.jpg         WhatsApp / social preview image (1200×630)
assets/music/         optional zaffa.mp3 (see below)
```

## Editing
- Date / time: `CONFIG.eventStart` in `js/main.js` (+ the `.ics` file and the Google Calendar dates).
- Music: by default streams "زفة موسيقى طلت عروس" from YouTube. To play a file instead
  (more reliable on iPhone), add `assets/music/zaffa.mp3` and redeploy.

## Run locally
```
npx serve .
```
