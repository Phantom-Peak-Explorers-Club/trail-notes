# Phantom Peak Trail Notes

A public archive of Phantom Peak Canada Water trail write-ups, organised by year and season. The landing page also reserves a place for Stratford trails when those write-ups are ready.

## Contents

- `index.html`: location landing page
- `canada-water.html`: searchable Canada Water collection and season PDF downloads
- `canada-water.js`: season catalogue, filters and browsing behaviour
- `trails.json`: searchable individual trail index
- `pdfs/`: season write-ups from 2022 through The Great Undoing (2026)
- `content/`: new write-ups drafted from supplied notes for Seasons 14–16
- `scripts/build_new_seasons.py`: regenerates the three new PDFs and their trail entries

The 2025 Hallowed Peak and Wintermas write-ups and the 2026 Great Undoing write-up were drafted from notes supplied for the archive. Earlier season PDFs are the supplied source files.

The site is static and runs on GitHub Pages at https://ppec.club/trail-notes/. For local browsing, serve the repository over HTTP so the page can load `trails.json`.
