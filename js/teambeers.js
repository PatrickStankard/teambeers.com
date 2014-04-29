(function($, window, document, undefined) {
  'use strict';

  window.TeamBeers = function() {
    this.answer = false;
    this.hash = '';

    $(function() {
      this.$answer = {
        wrapper: {
          p: $('p#teambeers-answer-wrapper'),
          animation: {
            start: function() {
              this.$answer.wrapper.p.addClass('animated pulse');
            }.bind(this),
            stop: function() {
              this.$answer.wrapper.p.removeClass('animated pulse');
            }.bind(this)
          }
        },
        text: {
          strong: $('strong#teambeers-answer-text')
        }
      };

      this.$toggle = {
        row: {
          div: $('div#teambeers-toggle-row'),
          show: function() {
            this.$toggle.row.div.removeClass('invisible');
          }.bind(this),
          hide: function() {
            this.$toggle.row.div.addClass('invisible');
          }.bind(this)
        },
        celebration: {
          button: $('button#teambeers-celebration-toggle'),
          icon: $('span#teambeers-celebration-toggle-icon'),
          show: function() {
            this.$toggle.celebration.button.removeClass('invisible');
          }.bind(this),
          hide: function() {
            this.$toggle.celebration.button.addClass('invisible');
          }.bind(this),
          play: function() {
            this.$toggle.celebration.icon.removeClass('glyphicon-play')
                                         .addClass('glyphicon-stop');
          }.bind(this),
          stop: function() {
            this.$toggle.celebration.icon.removeClass('glyphicon-stop')
                                         .addClass('glyphicon-play');
          }.bind(this),
          state: function() {
            var state = this.$toggle.celebration.icon.hasClass(
              'glyphicon-stop'
            );

            return state === true ? 'play' : 'stop';
          }.bind(this)
        },
        horn: {
          button: $('button#teambeers-horn-toggle'),
          show: function() {
            this.$toggle.horn.button.removeClass('invisible');
          }.bind(this),
          hide: function() {
            this.$toggle.horn.button.addClass('invisible');
          }.bind(this)
        }
      };

      this.$mp3 = {
        celebration: {
          audio: $('audio#teambeers-celebration-mp3'),
          toggle: function() {
            var params = {
              id: 'celebration'
            };

            switch (this.$toggle.celebration.state()) {
              case 'play':
                this.stopMediaElement(params);

                break;
              case 'stop':
                this.startMediaElement(params);

                break;
              default:
                return false;
            }
          }.bind(this)
        },
        horn: {
          audio: $('audio#teambeers-horn-mp3'),
          toggle: function() {
            var params = {
              id: 'horn'
            };

            this.stopMediaElement(params);
            this.startMediaElement(params);
          }.bind(this)
        }
      };

      this.$mp4 = {
        spuds: {
          video: $('video#teambeers-spuds-mp4'),
          show: function() {
            this.$mp4.spuds.video.removeClass('hidden');
          }.bind(this),
          hide: function() {
            this.$mp4.spuds.video.addClass('hidden');
          }.bind(this)
        }
      };

      this.setEventListeners();
      this.checkHash();
    }.bind(this));
  };

  window.TeamBeers.prototype.setEventListeners = function() {
    $(window).on(
      'hashchange',
      this.checkHash.bind(this)
    );

    this.$toggle.celebration.button.on(
      'click',
      this.$mp3.celebration.toggle.bind(this)
    );

    this.$toggle.horn.button.on(
      'click',
      this.$mp3.horn.toggle.bind(this)
    );
  };

  window.TeamBeers.prototype.checkHash = function() {
    this.hash = window.location.hash.toLowerCase();

    switch (this.hash) {
      case '#!/emergency':
        this.manualOverride({
          answer: true
        });

        break;
      default:
        this.determineAnswer();

        clearInterval(this.determineAnswerInterval);

        this.determineAnswerInterval = setInterval(
          this.determineAnswer.bind(this),
          1000
        );
    }
  };

  window.TeamBeers.prototype.startMediaElement = function(params) {
    var media = {
      id: null
    };

    if (typeof params === 'object') {
      if (typeof params.id === 'string') {
        media.id = params.id;
      }
    }

    switch (media.id) {
      case 'celebration':
        media.element = this.$mp3.celebration.audio;
        media.success = this.$toggle.celebration.play;
        media.complete = this.$toggle.celebration.show;

        break;
      case 'horn':
        media.element = this.$mp3.horn.audio;
        media.complete = this.$toggle.horn.show;

        break;
      case 'spuds':
        media.element = this.$mp4.spuds.video;
        media.success = this.$mp4.spuds.show;

        break;
      default:
        return false;
    }

    media.element = media.element[0];

    if (media.id === 'horn') {
      media.element.volume = 0.3;
    }

    $(media.element).one('canplay canplaythrough', function() {
      media.element.play();

      if (typeof media.success === 'function') {
        media.success();
      }
    });

    media.element.load();

    if (typeof media.complete === 'function') {
      media.complete();
    }
  };

  window.TeamBeers.prototype.stopMediaElement = function(params) {
    var media = {
      id: null
    };

    if (typeof params === 'object') {
      if (typeof params.id === 'string') {
        media.id = params.id;
      }
    }

    switch (media.id) {
      case 'celebration':
        media.element = this.$mp3.celebration.audio;

        this.$toggle.celebration.stop();

        break;
      case 'horn':
        media.element = this.$mp3.horn.audio;

        break;
      case 'spuds':
        media.element = this.$mp4.spuds.video;

        this.$mp4.spuds.hide();

        break;
      default:
        return false;
    }

    media.element = media.element[0];

    media.element.pause();

    if (media.element.currentTime !== 0) {
      media.element.currentTime = 0;
    }
  };

  window.TeamBeers.prototype.calculateAnswer = function() {
    var now, day, hours, minutes;

    now = new Date();

    day = {
      value: now.getUTCDay(),
      pass: false
    };

    hours = {
      value: now.getUTCHours(),
      pass: false
    };

    minutes = {
      value: now.getUTCMinutes(),
      pass: false
    };

    day.pass = day.value === 5 ||
               day.value === 6;

    switch (day.value) {
      case 5:
        hours.pass = hours.value >= 20;
        minutes.pass = minutes.value >= 40 && hours.pass === true;

        if (minutes.pass === false) {
          minutes.pass = hours.value >= 21;
        }

        break;
      case 6:
        hours.pass = hours.value <= 3;
        minutes.pass = hours.pass === true;

        break;
    }

    if (day.pass === true && hours.pass === true && minutes.pass === true) {
      this.answer = true;
    } else {
      this.answer = false;
    }
  };

  window.TeamBeers.prototype.updateAnswer = function() {
    var text, mediaElements, actions, x,
        len;

    text = {
      current: this.$answer.text.strong.text(),
      latest: this.answer === true ? 'YES' : 'NO'
    };

    mediaElements = [
      'celebration',
      'horn',
      'spuds'
    ];

    if (text.current !== text.latest) {
      this.$answer.text.strong.text(text.latest);

      if (this.answer === true) {
        actions = ['start', 'show'];
      } else {
        actions = ['stop', 'hide'];
      }

      this.$answer.wrapper.animation[actions[0]]();
      this.$toggle.row[actions[1]]();

      for (x = 0, len = mediaElements.length; x < len; x++) {
        this[actions[0] + 'MediaElement']({
          id: mediaElements[x]
        });
      }
    }
  };

  window.TeamBeers.prototype.determineAnswer = function() {
    this.calculateAnswer();
    this.updateAnswer();
  };

  window.TeamBeers.prototype.manualOverride = function(params) {
    if (typeof params === 'object') {
      if (typeof params.answer === 'boolean') {
        this.answer = params.answer;

        clearInterval(this.determineAnswerInterval);
        this.updateAnswer();
      }
    }
  };
})(jQuery, window, document);
