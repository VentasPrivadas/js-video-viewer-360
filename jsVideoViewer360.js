/*
 * jsVideoViewer.js: an HTML5 video viewer for 360 images sets
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
        direction: 'clockwise',
        moveInterval: 100,
        cursor: 'pointer',
    };

    this.state = {
        frameDuration: 0,
        lastTime: 0,
        lastX: 0,
        paused: false,
        mouseDown: false,
    };

    this.init = function() {
        if (options) {
            this.setEl(options.el);
            this.setFps(options.fps);
            this.setFrames(options.frames);
            this.setDirection(options.direction);
            this.setMoveInterval(options.moveInterval);
            this.setCursor(options.cursor);
        }

        this.initState();
        this.setVideo();
        this.initVideo();

        this.tMove = this.throttle(this.move, this.options.moveInterval);
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

    this.setDirection = function(direction) {
        if (direction == 'clockwise' ||
            direction == 'counterclockwise') {
            this.options.direction = direction;
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

    this.initState = function() {
        this.state.frameDuration = 1.0 / this.options.fps;
        this.state.lastTime = 
            this.state.frameDuration * (this.options.frames - 1);
    };

    this.initVideo = function() {
        var self = this;

        this.video.attr('loop', 'loop');
        this.video.css('cursor', self.options.cursor);

        this.video.on({
            loadedmetadata: function() {
                self.getEl().append(self.video);
                self.video.get(0).play();
            },
            mousedown: function(event) {
                self.state.mouseDown = true;
                self.state.lastX = event.pageX;
                self.video.get(0).pause();
            },
            mouseup: function() {
                self.state.mouseDown = false;
                self.video.get(0).play();
            },
            mouseout: function() {
                self.state.mouseDown = false;
                self.video.get(0).play();
            },
            mousemove: function(event) {
                if (self.state.mouseDown) {
                    if (event.pageX < self.state.lastX)  {
                        self.tMove('left');
                    }
                    if (event.pageX > self.state.lastX) {
                        self.tMove('right');
                    }
                    self.state.lastX = event.pageX;
                };
                return false;
            },
        });

        var src = this.getEl().attr('data-src');
        this.video.attr('src', src);
    };

    this.moveRight = function() {
        var video = this.video.get(0);
        if (video.currentTime >= this.state.lastTime) {
            video.currentTime = 0;
        } else {
            video.currentTime += this.state.frameDuration;
        }
    };

    this.moveLeft = function() {
        var video = this.video.get(0);
        if (video.currentTime < this.state.frameDuration) {
            video.currentTime = this.state.lastTime;
        } else {
            video.currentTime -= this.state.frameDuration;
        }
    };

    this.move = function(moveTo) {
        if (this.options.direction == 'counterclockwise') {
            moveTo = (moveTo == 'right') ? 'left' : 'right';
        }
        if (moveTo == 'right') {
            this.moveRight();
        } else {
            this.moveLeft();
        }
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
