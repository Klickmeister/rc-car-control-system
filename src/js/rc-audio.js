const RCAudio = {
  init: () => {

    console.log("init RCAudio");

    this.engine1Rate = 1.0;
    this.engine2Rate = 1.1;
    this.rateRiseEngine1 = 0.02;
    this.rateRiseEngine2 = 0.1;

    this.engine1Volume = 10;
    this.engine2Volume = 2;
    this.volumeRiseEngine1 = 1;
    this.volumeRiseEngine2 = 5;

    this.speed = 0;
    this.maxSpeed = 50;
    
    this.driftVolume = 5;
    this.driftRate = 10;
  
  
    this.engine1 = new Howl({
      src: ['/audio/car-engine-3.mp3'],
      autoplay: false,
      loop: true,
      sprite: {
        middle: [20, 100],
        end: [0,20]
      },
      volume: this.engine1Volume
    });
    
    this.engine2 = new Howl({
      src: ['/audio/car-engine-2.mp3'],
      autoplay: false,
      loop: true,
      sprite: {
        middle: [30, 90],
        end: [0,20]
      },
      volume: this.engine2Volume
    });

    this.drift = new Howl({
      src: ['/audio/car-skid.mp3'],
      autoplay: false,
      loop: true,
      sprite: {
        middle: [10,300],
        end: [0,20]
      },
      volume: this.driftVolume
    });

    RCAudio.startEngine();
    RCAudio.startDrift();
    
  },

  startEngine: () => { 

    this.dynEngine1 = this.engine1.play('middle');
    this.dynEngine2 = this.engine2.play('middle');

    RCAudio.modifyEngine();
  },

  startDrift: () => { 

    this.driftEngine = this.drift.play('middle');
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
    this.engine2.volume(this.engine2Volume, this.dynEngine2);

    this.drift.rate(this.driftRate, this.driftEngine);
    this.drift.volume(this.driftVolume, this.driftEngine);
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
    RCAudio.weaker();
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
  },

  acceleration: (accData) => { 

    if (accData > 0 && this.speed < this.maxSpeed) {
      this.speed += 0.2;
      RCAudio.faster();
    } else if (this.speed > 0) { 
      this.speed -= 0.2;
      RCAudio.slower();
    }
    
  },

  drift: (rate) => { 
    var output = document.querySelector('.output');
    
    //this.driftVolume = this.speed;
    if (this.speed < 3) {
      output.innerHTML = "drift : " + this.speed + " " + this.driftRate + "\n";
      //this.driftVolume = 0;
    } else {
      //this.driftVolume = 20;
     }
    this.driftRate = (Math.abs(rate/2));
    
    RCAudio.modifyEngine();
  }

}