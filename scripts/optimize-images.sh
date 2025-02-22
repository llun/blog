#!/bin/bash

magick mogrify -format webp -quality 82 public/gallery/*.jpg
magick mogrify -format avif -quality 50 public/gallery/*.jpg
