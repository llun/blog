You are reviewing the photos that will stay in bird albums on a photo blog. Do not edit any file except the votes files named below.

Albums to review: the album names listed (one per line) in ALBUMS_FILE. For each album, .cache/birds-dedupe/<album>/blur/ (relative to the repo root, the current directory) holds the photos still shown, in the order they were taken: numbered sheets sheet-NNN.jpg (12 photos each, labelled with their photo number) and every photo at full size as NNN.jpg. photos.json lists the numbers. Bursts of near-identical frames have already been reduced to one keeper each.

First read scripts/birds-quality-guide.md: it is how the owner judges photos, learned from their own corrections. Apply it. In addition, the owner asked for blurry photos to be removed: hide a photo when the bird itself is clearly out of focus or smeared (not just the background), except a deliberate action frame (take-off, flight) where the bird is still recognisable.

Work through each album's sheets in order so you see neighbouring photos of the same scene together; open the full-size NNN.jpg and zoom into the bird whenever a photo might be hidden. Never hide every photo of a scene: leave the best one, even if weak.

Calibration: the owner corrected only about 10% of the bursts they reviewed and left the rest as they were. Hide sparingly: a typical album should lose roughly 5-20% of these photos, and if you are above 25% you are being too strict, so go back over your repeat calls. Treat a photo as a repeat only when it is nearly identical to a photo that stays (same pose, same framing, taken within about a minute) and adds nothing; a different pose, angle, action, light or composition is a reason to keep it. When unsure, keep.

Write .cache/birds-dedupe/<album>/blur/votes-MODEL.json: a JSON array of the photo numbers to HIDE, e.g. [3, 17, 18]. Write [] if none. Every album in the list must get a file.
Reply with the files written and the number of photos hidden per album.
