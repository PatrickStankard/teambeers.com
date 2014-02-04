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

      self.$celebrationToggle.on('click', function() {
        self.toggleCelebration();
      });

      self.isCelebrationMp3PlayingTimeout = null;

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

  TeamBeers.prototype.startCelebration = function() {
    var self = this;

    self.$celebrationToggleIcon.removeClass('glyphicon-play')
                               .addClass('glyphicon-stop');

    self.$celebrationMp3[0].play();

    self.isCelebrationMp3PlayingTimeout = setTimeout(function() {
      if (self.$celebrationMp3[0].currentTime === 0) {
        self.stopCelebration();
      }
    }, 500);
  };

  TeamBeers.prototype.stopCelebration = function() {
    clearTimeout(this.isCelebrationMp3PlayingTimeout);

    this.$celebrationToggleIcon.removeClass('glyphicon-stop')
                               .addClass('glyphicon-play');

    this.$celebrationMp3[0].pause();

    if (this.$celebrationMp3[0].currentTime !== 0) {
      this.$celebrationMp3[0].currentTime = 0;
    }
  };

  TeamBeers.prototype.toggleCelebration = function() {
    if (this.$celebrationToggleIcon.hasClass('glyphicon-stop')) {
      this.stopCelebration();
    } else if (this.$celebrationToggleIcon.hasClass('glyphicon-play')) {
      this.startCelebration();
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
        this.startCelebration();
      } else {
        this.stopAnswerAnimation();
        this.hideCelebrationToggle();
        this.stopCelebration();
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
