# JS library to display videos for 360 images sets

## Create video for images set

    avconv -r 1 -i %04d.jpg -vf "scale=500:500" video.webm

## Use example

```html
<div id="my-viewer" data-src="video.webm"></div>

```

```javascript
$(document).ready(function() {

    var viewer = new jsVideoViewer360({
        el: 'my-viewer',
        fps: 1,
        frames: 36,
        direction: 'clockwise',
        fpsOnPlay: 25,
        moveInterval: 20,
    });

    viewer.init();

});
```

