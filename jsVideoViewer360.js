var jsVideoViewer360 = function(params) {

    this.video = null;

    this.params = {
        el: null,
        fps: 1,
        frames: 24,
        direction: 'clockwise',
        fpsOnPlay: 12,
        moveInterval: 50,
    };

    this.state = {
        frameDuration: 0,
        lastFrame: 0,
        lastMove: 'right',
        lastX: 0,
        paused: false,
        mouseDown: false,
        mouseDownX: 0,
    };

    this.init = function() {
        if (params) {
            this.setEl(params.el);
            this.setFps(params.fps);
            this.setFrames(params.frames);
            this.setDirection(params.direction);
            this.setFpsOnPlay(params.fpsOnPlay);
            this.setMoveInterval(params.moveInterval);
        }

        this.initState();
        this.setVideo();
        this.initVideo();

        this.tMove = this.throttle(this.move, this.params.moveInterval);
    };

    this.setEl = function(el) {
        this.params.el = $('#' + el);
    };

    this.getEl = function() {
        if (this.params.el == null) {
            throw new Error('el is not defined');
        }

        return this.params.el;
    };

    this.setVideo = function() {
        var src = this.params.el.attr('data-src');
        if (src) {
            this.video = $('<video src="' + src + '"/>');
        }
    };

    this.getVideo = function() {
        if (this.video == null) {
            throw new Error('video not set');
        }

        return this.video;
    };

    this.setFps = function(fps) {
        if (fps !== undefined) {
            this.params.fps = fps;
        }
    };

    this.setFrames = function(frames) {
        if (frames !== undefined) {
            this.params.frames = frames;
        }
    };

    this.setDirection = function(direction) {
        if (direction == 'clockwise' ||
            direction == 'counterclockwise') {
            this.params.direction = direction;
        }
    };

    this.setFpsOnPlay = function(fpsOnPlay) {
        if (fpsOnPlay !== undefined) {
            this.params.fpsOnPlay = fpsOnPlay;
        }
    };

    this.setMoveInterval = function(moveInterval) {
        if (moveInterval !== undefined) {
            this.params.moveInterval = moveInterval;
        }
    };

    this.initState = function() {
        this.state.frameDuration = 1.0 / this.params.fps;
        this.state.lastFrame = 
            this.state.frameDuration * (this.params.frames - 1);
    };

    this.initVideo = function() {
        var self = this;

        var video = this.getVideo();
        video.css('cursor', 'pointer');

        video.on({
            loadedmetadata: function() {
                self.getEl().append(video);
                setInterval(function() {
                    if ( ! self.state.paused ) {
                        self.move(self.state.lastMove);
                    }
                }, (1000 / self.params.fpsOnPlay));
            },
            mousedown: function(event) {
                self.state.mouseDown = true;
                self.state.mouseDownX = event.pageX;
                self.state.lastX = event.pageX;
                self.state.paused = true;
            },
            mouseup: function(event) {
                self.state.paused = ! self.mouseUpNearDownPosition(event);
                self.state.mouseDown = false;
            },
            mouseout: function() {
                self.state.mouseDown = false;
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
    };

    this.mouseUpNearDownPosition = function(event) {
        var xDown = this.state.mouseDownX;
        var xUp = event.pageX;
        return (xUp >= (xDown - 5) && xUp <= (xDown + 5));
    };

    this.moveRight = function() {
        var video = this.getVideo().get(0);
        if (video.currentTime >= this.state.lastFrame) {
            video.currentTime = 0;
        } else {
            video.currentTime += this.state.frameDuration;
        }
    };

    this.moveLeft = function() {
        var video = this.getVideo().get(0);
        if (video.currentTime < this.state.frameDuration) {
            video.currentTime = this.state.lastFrame;
        } else {
            video.currentTime -= this.state.frameDuration;
        }
    };

    this.move = function(moveTo) {
        this.state.lastMove = moveTo;
        if (this.params.direction == 'counterclockwise') {
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
