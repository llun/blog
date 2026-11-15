You are judging bird photos for a photo blog. Do not edit any file except the votes files named below.

Albums to judge: every folder under .cache/birds-dedupe/ (relative to the repo root, the current directory) whose groups.json is a non-empty list and that has no votes-MODEL.json newer than its groups.json. Each such folder has, for every group N, a contact sheet group-NNN.jpg (frames labelled a, b, c...) and a folder group-NNN/ with the same frames at full size as a.jpg, b.jpg, ... Every group is one burst of near-identical frames of the same bird.

For every group, pick the single best frame to keep. Judge the BIRD, not the background:
1. The bird is in sharp focus, ideally the eye. Open the full-size frames and zoom into the bird; birds are often small, and sharp branches don't count.
2. No motion blur on the bird; good exposure (not blown out or murky).
3. The whole bird is in frame and not hidden by branches; a pleasing pose (head turned towards the camera, eye visible).
Look at every frame in the group at full size before deciding; don't judge from the contact sheet alone.

Write one JSON file per album: .cache/birds-dedupe/<album>/votes-MODEL.json mapping group number (string) to the chosen letter, for example {"1": "c", "2": "a"}. Every group in groups.json must have an entry.
Reply with the list of files written and one line per hard call.
