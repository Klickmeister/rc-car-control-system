const RCAudio = {
  init: () => {

    this.engine1Rate = 1.0;
    this.engine2Rate = 1.1;
    this.rateRiseEngine1 = 0.1;
    this.rateRiseEngine2 = 0.3;

    this.engine1Volume = 10;
    this.engine2Volume = 2;
    this.volumeRiseEngine1 = 1;
    this.volumeRiseEngine2 = 5;
    
  
    this.engine1 = new Howl({
      src: ['assets/audio/car-engine-3.mp3'],
      autoplay: false,
      loop: true,
      sprite: {
        middle: [20, 100],
        end: [0,20]
      },
      volume: this.engine1Volume
    });
    
    this.engine2 = new Howl({
      src: ['assets/audio/car-engine-2.mp3'],
      autoplay: false,
      loop: true,
      sprite: {
        middle: [30, 90],
        end: [0,20]
      },
      volume: this.engine2Volume
    });



    RCAudio.startEngine();

  },

  startEngine: () => { 

    this.dynEngine1 = this.engine1.play('middle');
    this.dynEngine2 = this.engine2.play('middle');

    RCAudio.modifyEngine();
  },

  stopEngine: () => { 
    this.engine1.stop();
    this.engine2.stop();
  },

  modifyEngine: () => { 
    this.engine1.rate(this.engine1Rate, this.dynEngine1);
    this.engine2.rate(this.engine2Rate, this.dynEngine2);

    this.engine1.volume(this.engine1Volume, this.dynEngine1);
    this.engine2.volume(this.engine2Volume, this.dynEngine1);
  },

  faster: () => { 
    this.engine1Rate += this.rateRiseEngine1;
    this.engine2Rate += this.rateRiseEngine2;
    RCAudio.louder();
    RCAudio.modifyEngine();
  },

  slower: () => { 
    this.engine1Rate -= this.rateRiseEngine1;
    this.engine2Rate -= this.rateRiseEngine2;
    RCAudio.louder();
    RCAudio.modifyEngine();
  },

  louder: () => { 
    this.engine1Volume += this.volumeRiseEngine1;
    this.engine2Volume += this.volumeRiseEngine2;

    RCAudio.modifyEngine();
  },

  weaker: () => { 
    this.engine1Volume -= this.volumeRiseEngine1;
    this.engine2Volume -= this.volumeRiseEngine2;

    RCAudio.modifyEngine();
  }
}

RCAudio.init();





