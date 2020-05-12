function Audio(name, url) {

    // Declare
    var media = this;
    media.name = name || "untitled";
    media.url = url || "";
    media.state = 0; // 0 = pause, 1 = playing
    media.loopState = 0; // 0 = not playing, 1 = playing
  
    // Init
    var element = document.createElement("AUDIO");
    element.src = media.url;
    element.style.display = "none";
    element.id = media.name;
    document.body.appendChild(element);
    media.element = document.getElementById(media.name);
  
    //Methods
    media.play = function (vol) {
      media.volume = vol || 1;
      media.element.play();
    };
    media.pause = function () {
      media.element.pause();
    };
    media.toggle = function () {
      if (media.state) {
        media.element.pause();
      } else {
        media.element.play();
      }
      media.state = media.state == 1 ? 0 : 1;
    }
    media.reload = function () {
      media.element.load();
    };
    media.load = function (src) {
      if (src) {
        media.element.setAttribute("src", src);
      }
      media.element.load();
    };
    media.stop = function () {
      media.element.pause();
      media.element.currentTime = 0;
    };
    media.setLoop = function (loop) {
      if (loop) {
        media.element.setAttribute("loop", loop);
      } else {
        media.element.removeAttribute("loop");
      }
    };
    media.seamlessLoop = function (fadeLength) { // in seconds
      if (!media.loopCopy) {
        media.loopCopy = new Audio(media.name + "Copy", media.url);
      }
      media.loopCopy.stop();
      media.stop();
      media.loopCopy.stop();
      media.loopSelection = 0;
  
      function SL() {
        if (!!media.loopSelection) {
          media.loopSelection = 0;
          media.loopCopy.fadeIn(fadeLength - 1);
          media.loopCopy.fadeOutAtEnd(fadeLength, SL);
        } else {
          media.loopSelection = 1;
          media.fadeIn(fadeLength - 1);
          media.fadeOutAtEnd(fadeLength, SL);
        }
      }
      SL();
    };
    media.stopSeamlessLoop = function () {
      media.stop();
      media.loopCopy.stop();
    };
    media.fadeOutSeamlessLoop = function (fadeLength) {
      if (media.loopSelection) {
        media.loopCopy.stop();
        clearInterval(media.fadeOutListener);
        media.fadeOut(fadeLength);
      } else {
        media.stop();
        clearInterval(media.loopCopy.fadeOutListener);
        media.loopCopy.fadeOut(fadeLength);
      }
    };
    media.toggleSeamlessLoop = function (fadeLength) {
      if (media.loopState) {
        media.fadeOutSeamlessLoop(fadeLength);
      } else {
        media.seamlessLoop(fadeLength);
      }
      media.loopState = media.loopState == 1 ? 0 : 1;
    };
    media.fadeIn = function (fadeLength, finished) {
      var playing = false;
      media.stop();
      media.setVolume(0);
      var fader = setInterval(function () {
        if (!playing) {
          media.element.play();
          playing = true;
        }
        if (media.element.currentTime < fadeLength) {
          try {
            media.element.volume += 1 / (fadeLength * 100);
          } catch (e) {
            finished && finished();
            clearInterval(fader);
          }
        } else {
          finished && finished();
          clearInterval(fader);
        }
      }, 10);
    };
    media.fadeOutAtEnd = function (fadeLength, started, finished) {
      var fadingOut = false;
      media.fadeOutListener = setInterval(function () {
        function end() {
          if (finished) {
            finished();
          }
          media.stop();
          clearInterval(media.fadeOutListener);
        }
        var currentTime = media.element.currentTime,
          length = media.element.duration;
        if (currentTime <= length) {
          if (currentTime >= length - fadeLength) {
            if (!fadingOut) {
              fadingOut = true;
              if (started) {
                started();
              }
            }
            if (media.element.volume > 0) {
              try {
                media.element.volume -= 1 / (fadeLength * 100);
              } catch (e) {
                end();
              }
            } else {
              end();
            }
          }
        } else {
          end();
        }
      }, 10);
    };
    media.fadeOut = function (fadeLength, finished) {
      clearInterval(media.fadeOutListener);
      media.fadeOutListener = setInterval(function () {
        function end() {
          finished && finished();
          media.stop();
          clearInterval(media.fadeOutListener);
        }
        if (media.element.volume > 0) {
          try {
            media.element.volume -= 1 / (fadeLength * 100);
          } catch (e) {
            end();
          }
        } else {
          end();
        }
      }, 10);
    };
    media.setPosition = function (n) {
      media.element.currentTime = n;
    };
    media.setVolume = function (percent) {
      media.element.volume = percent * 0.01;
    };
    media.setRate = function (rate) {
      media.element.playbackRate = rate;
    };
  }
  
  function AudioGallery(audio, root) {
  
    // Delcare
    var gallery = this;
    gallery.audio = {};
    gallery.root = root || false;
  
    // Init
    for (var name in audio) {
      gallery.audio[name] = new Audio(name, (root && root || "") + audio[name]);
    }
  
    // Methods
    gallery.play = function (name, vol, only) {
      if (only) {
        gallery.stopAll();
      }
      gallery.audio[name].play(vol);
    };
    gallery.pause = function (name) {
      gallery.audio[name].pause();
    };
    gallery.toggle = function (name) {
      gallery.audio[name].toggle();
    };
    gallery.stop = function (name) {
      gallery.audio[name].stop();
    };
    gallery.stopAll = function () {
      for (var name in gallery.audio) {
        gallery.audio[name].stop();
      }
    };
    gallery.toggleSeamlessLoop = function (name, fadeLength) {
      gallery.audio[name].toggleSeamlessLoop(fadeLength);
    };
    gallery.playRandom = function () {
      var audio = Object.keys(gallery.audio);
      var audioFile = gallery.audio[
        audio[
          Math.floor(Math.random() * audio.length)
        ]
      ];
      audioFile.stop();
      audioFile.play();
    }
  }
  