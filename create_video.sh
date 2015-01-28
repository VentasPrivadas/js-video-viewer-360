#!/bin/bash
avconv -r 12 -i %04d.jpg -vf "scale=500:500" video.webm
