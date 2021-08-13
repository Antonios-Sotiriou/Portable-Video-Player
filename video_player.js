var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
    // set up custom controls
    var videoContainer = document.getElementById('videoContainer');
    var video = document.getElementById('video');
    var videoControlers = document.getElementById('video-controlers');

    // Hide the default controls
    video.controls = false;
    // Display the user defined video controls
    videoControlers.style.display = 'flex';

    var playpause = document.getElementById('playpause');
    var stop = document.getElementById('stop');
    var mute = document.getElementById('mute');
    var volinc = document.getElementById('volinc');
    var voldec = document.getElementById('voldec');
    var progress = document.getElementById('progress');
    var progressBar = document.getElementById('progress-bar');
    var progressMaxTime = document.getElementById('progress-maxtime');
    var progressCurrentTime = document.getElementById('progress-currenttime');
    var fullscreen = document.getElementById('fs');

    let shown = false;
    const hideControlers = () => {
        videoControlers.style.height = '0px'
        shown = false
    }
    const showControlers = () => {
        videoControlers.style.height = '30px'
        shown = true
    }
    let active = setTimeout(hideControlers, 0);

    const hhmmss = (duration) => {
        let hours = Math.floor(duration / 3600);
        let mins = Math.floor((duration - (hours * 3600)) / 60);
        let secs = duration - (hours * 3600) - (mins * 60);

        if (hours < 10 && hours >= 1) {
            hours = '0' + hours + ':';
        } else if (hours < 1 || hours === 0) {
            hours = '';
        } else {
            hours = hours + ':';
        }
        if (mins < 10) {mins = "0" + mins;}
        if (secs < 10) {secs = "0" + secs;}

        return `${hours}${mins}:${secs}`
    }

    // If the device has not 'ontouchevent' activate pointermove to show controls when mouse moves.
    if (!('ontouchstart' in window) || (navigator.maxTouchPoints === 0) || (navigator.msMaxTouchPoints === 0)) {
        videoContainer.addEventListener('pointermove', (e) => {
            if (e.target.parentNode.className === 'video-controlers' || e.target.parentNode.nodeName === 'LI') {
                showControlers()
                clearTimeout(active)
                active = setTimeout(hideControlers, 10000);
            } else {
                showControlers()
                clearTimeout(active)
                active = setTimeout(hideControlers, 2000);
            }
        })
    }

    if (this.navigator.vendor === 'Google Inc.' && this.navigator.userAgent.indexOf('Chrome/') !== -1) {
        videoContainer.addEventListener('click', (e) => {
            if (e.target.nodeName === 'VIDEO') {
                if (!shown) {
                    showControlers()
                    clearTimeout(active)
                    active = setTimeout(hideControlers, 10000)
                } else {
                    clearTimeout(active)
                    hideControlers()
                }
            } else if (e.target.offsetParent.className === 'video-controlers' || e.target.offsetParent.nodeName === 'LI') {
                showControlers()
                clearTimeout(active)
                active = setTimeout(hideControlers, 10000)
            }
        })
        progress.oninput = (e) => {
            progress.setAttribute('value', Number(e.target.value))
            video.currentTime = progress.getAttribute('value')
        }
    } else if (this.navigator.userAgent.indexOf('Firefox/')) {
        videoContainer.addEventListener('click', (e) => {
            if (e.target.nodeName === 'VIDEO') {
                if (!shown) {
                    showControlers()
                    clearTimeout(active)
                    active = setTimeout(hideControlers, 10000)
                } else {
                    clearTimeout(active)
                    hideControlers()
                }
            } else if (e.target.offsetParent.className === 'video-controlers' || e.target.offsetParent.nodeName === 'LI') {
                showControlers()
                clearTimeout(active)
                active = setTimeout(hideControlers, 10000)

                if (e.target.id === progress.id) {
                    var rect = e.target.getBoundingClientRect()
                    var pos = (e.pageX  - rect.left) / e.target.offsetWidth
                    video.currentTime = pos * video.duration
                }
            }
        })
    }

    playpause.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playpause.src = 'images/pause.png';
        } else {
            video.pause();
            playpause.src = 'images/play.png'
        }
    });

    stop.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        progress.value = 0;
        playpause.src = 'images/play.png'
    });

    mute.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            mute.src = 'images/mute.png'
        } else {
            mute.src = 'images/unmute.png'
        }
    });

    volinc.addEventListener('click', () => {
        alterVolume('+');
    });

    voldec.addEventListener('click', () => {
        alterVolume('-');
    });

    var alterVolume = (dir) => {
        var currentVolume = Math.floor(video.volume * 10) / 10;
        if (dir === '+') {
            if (currentVolume < 1) video.volume += 0.1;
        }
        else if (dir === '-') {
            if (currentVolume > 0) video.volume -= 0.1;
        }
    }

    video.addEventListener('loadedmetadata', () => {
        progress.setAttribute('max', video.duration);
        progressMaxTime.innerText = hhmmss(Math.floor(video.duration));
    });

    video.addEventListener('timeupdate', () => {
        if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
        progress.setAttribute('value', video.currentTime);
        progress.value = video.currentTime
        progressCurrentTime.innerText = hhmmss(Math.floor(video.currentTime));
        if (video.ended) {
            playpause.src = 'images/play.png'
        }
    });

    var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
    
    if (!fullScreenEnabled) {
        fullscreen.style.display = 'none';
    }
    
    fullscreen.addEventListener('click', (e) => {
        handleFullscreen();
    });

    var handleFullscreen = () => {
        if (isFullScreen()) {
           if (document.exitFullscreen) document.exitFullscreen();
           else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
           else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
           else if (document.msExitFullscreen) document.msExitFullscreen();
           setFullscreenData(false);
           fullscreen.src = 'images/fullscreen-enter.png'
        }
        else {
           if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
           else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
           else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
           else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
           setFullscreenData(true);
           fullscreen.src = 'images/fullscreen-exit.png'
        }
    }

    var isFullScreen = () => {
        return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }
     
    var setFullscreenData = (state) => {
        videoContainer.setAttribute('data-fullscreen', !!state);
    }
     
    document.addEventListener('fullscreenchange', function(e) {
        setFullscreenData(!!(document.fullscreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function() {
        setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function() {
        setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function() {
        setFullscreenData(!!document.msFullscreenElement);
    });
}

