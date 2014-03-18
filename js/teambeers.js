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
      self.$toggleRow = $('div#teambeers-toggle-row');
      self.$celebrationMp3 = $('audio#teambeers-celebration-mp3');
      self.$celebrationToggle = $('button#teambeers-celebration-toggle');
      self.$celebrationToggleIcon = $('span#teambeers-celebration-toggle-icon');
      self.$hornMp3 = $('audio#teambeers-horn-mp3');
      self.$hornToggle = $('button#teambeers-horn-toggle');
      self.$spudsMp4 = $('video#teambeers-spuds-mp4');

      self.$celebrationToggle.on('click', function() {
        self.toggleCelebrationMp3();
      });

      self.$hornToggle.on('click', function() {
        self.toggleHornMp3();
      });

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

  TeamBeers.prototype.showToggleRow = function() {
    this.$toggleRow.removeClass('invisible');
  };

  TeamBeers.prototype.hideToggleRow = function() {
    this.$toggleRow.addClass('invisible');
  };

  TeamBeers.prototype.showCelebrationToggle = function() {
    this.$celebrationToggle.removeClass('invisible');
  };

  TeamBeers.prototype.hideCelebrationToggle = function() {
    this.$celebrationToggle.addClass('invisible');
  };

  TeamBeers.prototype.showHornToggle = function() {
    this.$hornToggle.removeClass('invisible');
  };

  TeamBeers.prototype.hideHornToggle = function() {
    this.$hornToggle.addClass('invisible');
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
        media.$ = self.$celebrationMp3;

        media.success = function() {
          self.$celebrationToggleIcon.removeClass('glyphicon-play')
                                     .addClass('glyphicon-stop');
        };

        media.complete = function() {
          self.showCelebrationToggle();
        };

        break;
      case 'spuds':
        media.$ = self.$spudsMp4;

        media.success = function() {
          self.showSpudsMp4();
        };

        break;
      case 'horn':
        media.$ = self.$hornMp3;

        media.complete = function() {
          self.showHornToggle();
        };

        break;
      default:
        return false;
    }

    media.element = media.$[0];

    if (media.id === 'horn') {
      media.element.volume = 0.3;
    }

    media.$.one('canplay canplaythrough', function() {
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
        media.$ = self.$celebrationMp3;

        self.$celebrationToggleIcon.removeClass('glyphicon-stop')
                                   .addClass('glyphicon-play');
        break;
      case 'spuds':
        media.$ = self.$spudsMp4;

        self.hideSpudsMp4();
        break;
      case 'horn':
        media.$ = self.$hornMp3;
        break;
      default:
        return false;
    }

    media.element = media.$[0];

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

  TeamBeers.prototype.toggleHornMp3 = function() {
    this.stopMediaElement({
      id: 'horn'
    });

    this.startMediaElement({
      id: 'horn'
    });
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

    // friday
    day.pass = day.value === 5;
    // greater than or equal to 4:40pm, up until 7:00pm
    hours.pass = hours.value >= 20;
    minutes.pass = minutes.value >= 40 && hours.pass === true;

    if (minutes.pass === false) {
      minutes.pass = hours.value >= 22;
    }

    console.log(day, hours, minutes);

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
        this.showToggleRow();

        this.startMediaElement({
          id: 'celebration'
        });

        this.startMediaElement({
          id: 'horn'
        });

        this.startMediaElement({
          id: 'spuds'
        });
      } else {
        this.stopAnswerAnimation();
        this.hideToggleRow();

        this.stopMediaElement({
          id: 'celebration'
        });

        this.stopMediaElement({
          id: 'horn'
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
