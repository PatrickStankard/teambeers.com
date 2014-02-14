var TeamBeers;

(function($, window, document, undefined) {
  'use strict';

  TeamBeers = function() {
    var self = this;

    self.answer = false;
    self.hash = window.location.hash.toLowerCase();

    $(function() {
      self.$answerWrapper = $('p#teambeers-answer-wrapper');
      self.$answerText = $('strong#teambeers-answer-text');
      self.$celebrationRow = $('div#teambeers-celebration-row');
      self.$celebrationMp3 = $('audio#teambeers-celebration-mp3');
      self.$celebrationToggle = $('button#teambeers-celebration-toggle');
      self.$celebrationToggleIcon = $('span#teambeers-celebration-toggle-icon');
      self.$spudsMp4 = $('video#teambeers-spuds-mp4');

      self.$celebrationToggle.on('click', function() {
        self.toggleCelebrationMp3();
      });

      self.mediaElementPlayingTimeout = {};

      switch (self.hash) {
        case '#!/emergency':
          self.manualOverride({
            answer: true
          });

          break;
        default:
          self.calculateAndUpdateAnswer();

          self.calculateAndUpdateAnswerInterval = setInterval(function() {
            self.calculateAndUpdateAnswer();
          }, 1000);
      }
    });
  };

  TeamBeers.prototype.startAnswerAnimation = function() {
    this.$answerWrapper.addClass('animated pulse');
  };

  TeamBeers.prototype.stopAnswerAnimation = function() {
    this.$answerWrapper.removeClass('animated pulse');
  };

  TeamBeers.prototype.showCelebrationToggle = function() {
    this.$celebrationRow.removeClass('invisible');
  };

  TeamBeers.prototype.hideCelebrationToggle = function() {
    this.$celebrationRow.addClass('invisible');
  };

  TeamBeers.prototype.showSpudsMp4 = function() {
    this.$spudsMp4.removeClass('hidden');
  };

  TeamBeers.prototype.hideSpudsMp4 = function() {
    this.$spudsMp4.addClass('hidden');
  };

  TeamBeers.prototype.startMediaElement = function(params) {
    var self, media;

    self = this;

    media = {
      id: null
    };

    if (typeof params === 'object') {
      if (typeof params.id === 'string') {
        media.id = params.id;
      }
    }

    switch(media.id) {
      case 'celebration':
        media.element = self.$celebrationMp3[0];

        self.$celebrationToggleIcon.removeClass('glyphicon-play')
                                   .addClass('glyphicon-stop');
        break;
      case 'spuds':
        media.element = self.$spudsMp4[0];

        self.showSpudsMp4();
        break;
      default:
        return false;
    }

    media.element.play();

    (function(self, media, params) {
      self.mediaElementPlayingTimeout[media.id] = setTimeout(function() {
        if (media.element.currentTime === 0) {
          self.stopMediaElement(params);
        }
      }, 500);
    })(self, media, params);
  };

  TeamBeers.prototype.stopMediaElement = function(params) {
    var self, media;

    self = this;

    media = {
      id: null
    };

    if (typeof params === 'object') {
      if (typeof params.id === 'string') {
        media.id = params.id;
      }
    }

    switch(media.id) {
      case 'celebration':
        media.element = self.$celebrationMp3[0];

        self.$celebrationToggleIcon.removeClass('glyphicon-stop')
                                   .addClass('glyphicon-play');
        break;
      case 'spuds':
        media.element = self.$spudsMp4[0];

        self.hideSpudsMp4();
        break;
      default:
        return false;
    }

    clearTimeout(self.mediaElementPlayingTimeout[media.id]);

    media.element.pause();

    if (media.element.currentTime !== 0) {
      media.element.currentTime = 0;
    }
  };

  TeamBeers.prototype.toggleCelebrationMp3 = function() {
    if (this.$celebrationToggleIcon.hasClass('glyphicon-stop')) {
      this.stopMediaElement({
        id: 'celebration'
      });
    } else if (this.$celebrationToggleIcon.hasClass('glyphicon-play')) {
      this.startMediaElement({
        id: 'celebration'
      });
    }
  };

  TeamBeers.prototype.calculateAnswer = function() {
    var now, day, hours, minutes;

    now = new Date();

    day = {
      value: now.getUTCDay()
    };

    hours = {
      value: now.getUTCHours()
    };

    minutes = {
      value: now.getUTCMinutes()
    };

    day.pass = day.value === 5;
    hours.pass = hours.value >= 21;
    minutes.pass = (minutes.value >= 40 && hours.pass === true) || hours.value >= 22;

    if (day.pass === true && hours.pass === true && minutes.pass === true) {
      this.answer = true;
    } else {
      this.answer = false;
    }
  };

  TeamBeers.prototype.updateAnswer = function() {
    var text = {
      current: this.$answerText.text(),
      latest: this.answer === true ? 'YES' : 'NO'
    };

    if (text.current !== text.latest) {
      this.$answerText.text(text.latest);

      if (this.answer === true) {
        this.startAnswerAnimation();
        this.showCelebrationToggle();

        this.startMediaElement({
          id: 'celebration'
        });

        this.startMediaElement({
          id: 'spuds'
        });
      } else {
        this.stopAnswerAnimation();
        this.hideCelebrationToggle();

        this.stopMediaElement({
          id: 'celebration'
        });

        this.stopMediaElement({
          id: 'spuds'
        });
      }
    }
  };

  TeamBeers.prototype.calculateAndUpdateAnswer = function() {
    this.calculateAnswer();
    this.updateAnswer();
  };

  TeamBeers.prototype.manualOverride = function(params) {
    var self = this;

    if (typeof params === 'object') {
      if (typeof params.answer === 'boolean') {
        self.answer = params.answer;

        clearInterval(self.calculateAndUpdateAnswerInterval);
        self.updateAnswer();
      }
    }
  };
})(jQuery, window, document);
