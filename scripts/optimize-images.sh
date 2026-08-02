#!/bin/bash

set -euo pipefail

gallery_dir=public/gallery

if ! command -v magick >/dev/null 2>&1; then
  echo "magick not found. Install ImageMagick 7 (brew install imagemagick) and try again." >&2
  exit 1
fi

shopt -s nullglob
images=("$gallery_dir"/*.jpg)
shopt -u nullglob

if [ ${#images[@]} -eq 0 ]; then
  echo "No jpg files in $gallery_dir, nothing to optimize." >&2
  exit 0
fi

magick mogrify -format webp -quality 82 "${images[@]}"
magick mogrify -format avif -quality 50 "${images[@]}"
