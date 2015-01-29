#!/bin/bash
avconv -f image2 -r 12 -i images_cw/%04d.jpg -vf "scale=500:500" -b 8192k product_cw.webm
avconv -f image2 -r 12 -i images_ccw/%04d.jpg -vf "scale=500:500" -b 8192k product_ccw.webm
