#!/bin/bash
avconv -r 1 -i %04d.jpg -vf "scale=500:500" video.webm
