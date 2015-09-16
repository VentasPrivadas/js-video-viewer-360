# JS library to display videos from 360 images sets

## Requirements

 - jQuery (tested only with v1.8.2)

## Create video from images set

    avconv -f image2 -r 12 -i %04d.jpg -vf "scale=500:500" -b 8192k product.webm

## Use example

```html
<div id="product-viewer" data-src="product.webm"></div>

```

```javascript
$(document).ready(function() {

    var viewer = new jsVideoViewer360({
        el: 'product-viewer',
        fps: 12,
        frames: 24,
        rotation: 'clockwise',
        moveInterval: 100,
        cursor: 'pointer',
        autoplay: true,
        playbackRate: 1.0,
    });

    viewer.init();

});
```

