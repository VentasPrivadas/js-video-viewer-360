# JS library to display videos for 360 images sets

## Create video for images set

    avconv -r 1 -i %04d.jpg -vf "scale=500:500" video.webm

## Use example

    <div id="video" data-src="video.webm"></div>


    $(document).ready(function() {

        var viewer = new jsVideoViewer360({
            el: 'video',
            fps: 1,
            frames: 72,
            direction: 'clockwise',
            fpsOnPlay: 25,
            moveInterval: 20,
        });

        viewer.init();

    });


