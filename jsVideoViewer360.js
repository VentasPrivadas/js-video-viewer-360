/*
 *  jsVideoViewer.js v0.0.1 | An HTML5 video viewer for 360 images sets
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var jsVideoViewer360 = function(options) {

    this.video = null;

    this.options = {
        el: null,
        fps: 12,
        frames: 24,
        rotation: 'clockwise',
        moveInterval: 100,
        cursor: 'pointer',
        autoplay: true,
        playbackRate: 1.0,
    };

    this.state = {
        lastX: 0,
        paused: false,
        mouseDown: false,
        isChrome: window.chrome,
    };

    this.init = function() {
        if (options) {
            this.setEl(options.el);
            this.setFps(options.fps);
            this.setFrames(options.frames);
            this.setRotation(options.rotation);
            this.setMoveInterval(options.moveInterval);
            this.setCursor(options.cursor);
            this.setAutoplay(options.autoplay);
            this.setPlaybackRate(options.playbackRate);
        }

        this.setVideo();
        this.initVideo();

        this.tMove = this.throttle(
            this.move,
            this.options.moveInterval
        );
    };

    this.setEl = function(el) {
        this.options.el = $('#' + el);
    };

    this.getEl = function() {
        if (this.options.el == null) {
            throw new Error('el is not defined');
        }

        return this.options.el;
    };

    this.setVideo = function() {
        this.video = $('<video />');
    };

    this.setFps = function(fps) {
        if (fps !== undefined) {
            this.options.fps = fps;
        }
    };

    this.setFrames = function(frames) {
        if (frames !== undefined) {
            this.options.frames = frames;
        }
    };

    this.setRotation = function(rotation) {
        if (rotation == 'clockwise' ||
            rotation == 'counterclockwise') {
            this.options.rotation = rotation;
        }
    };

    this.setMoveInterval = function(moveInterval) {
        if (moveInterval !== undefined) {
            this.options.moveInterval = moveInterval;
        }
    };

    this.setCursor = function(cursor) {
        if (cursor !== undefined) {
            this.options.cursor = cursor;
        }
    };

    this.setAutoplay = function(autoplay) {
        if (autoplay !== undefined) {
            this.options.autoplay = autoplay;
        }
    };

    this.setPlaybackRate = function(playbackRate) {
        if (playbackRate !== undefined) {
            this.options.playbackRate = playbackRate;
        }
    };

    this.initVideo = function() {
        var self = this;

        this.video.attr('loop', 'loop');
        this.video.css('cursor', self.options.cursor);

        this.video.on({
            loadedmetadata: function() {
                self.video.get(0).playbackRate = self.options.playbackRate;
                self.getEl().append(self.video);
                if (self.options.autoplay) {
                    self.play(); 
                }
            },
            mousedown: function(event) {
                self.state.mouseDown = true;
                self.state.lastX = event.pageX;
                self.pause();
            },
            mouseup: function() {
                self.state.mouseDown = false;
            },
            mouseout: function() {
                self.state.mouseDown = false;
            },
            mousemove: function(event) {
                if (self.state.mouseDown) {
                    if (event.pageX > self.state.lastX) {
                        self.tMove('backward');
                    }
                    if (event.pageX < self.state.lastX)  {
                        self.tMove('forward');
                    }
                    self.state.lastX = event.pageX;
                };
                return false;
            },
        });

        var src = this.getEl().attr('data-src');
        this.video.attr('src', src);
    };

    this.getForwardTime = function(video) {
        var frame = this.getCurrentFrame() + 1;
        var frameTime = this.getFrameTime();
        var semiFrameTime = this.getSemiFrameTime();
        var time = (frameTime * frame) + semiFrameTime;
        return (time > video.duration) ? semiFrameTime : time;
    };

    this.moveForward = function() {
        var video = this.video.get(0);
        video.currentTime = this.getForwardTime(video);
    };

    this.getBackwardTime = function(video) {
        var frame = this.getCurrentFrame() - 1;
        var frameTime = this.getFrameTime();
        var semiFrameTime = this.getSemiFrameTime();
        var time = frameTime * frame;
        if (time < 0) {
            return (this.state.isChrome)
                ? video.duration - frameTime - semiFrameTime
                : video.duration - semiFrameTime;
        } else {
            return time + semiFrameTime;
        }
    };

    this.getFrameTime = function() {
        return 1 / this.options.fps;
    };

    this.getSemiFrameTime = function() {
        return this.getFrameTime() / 2;
    };

    this.moveBackward = function() {
        var video = this.video.get(0);
        video.currentTime = this.getBackwardTime(video);
    };

    this.forward = function() {
        this.move('forward');
    };

    this.backward = function() {
        this.move('backward');
    };

    this.move = function(direction) {
        if (this.options.rotation == 'counterclockwise') {
            direction = (direction == 'forward')
                ? 'backward' : 'forward';
        }
        if (direction == 'forward') {
            this.moveForward();
        } else {
            this.moveBackward();
        }
    };

    this.play = function() {
        this.video.get(0).play();
    };

    this.pause = function() {
        this.video.get(0).pause();
    };

    this.isPaused = function() {
        return this.video.get(0).paused;
    };

    this.getCurrentFrame = function() {
        return Math.floor(
            this.video.get(0).currentTime * this.options.fps
        );
    };

    this.now = Date.now || function() {
        return new Date().getTime();
    };

    this.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if ( ! options) options = {};
        var self = this;
        var later = function() {
            previous = options.leading === false ? 0 : self.now();
            timeout = null;
            result = func.apply(context, args);
            if ( ! timeout) context = args = null;
        };
        return function() {
            var now = self.now();
            if ( ! previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if ( ! timeout) context = args = null;
            } else if ( ! timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

};
