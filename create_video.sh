#!/bin/bash
avconv -r 1 -i %04d.jpg -vf "scale=640:480" video.webm
