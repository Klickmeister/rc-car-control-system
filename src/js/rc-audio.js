let engine1 = new Howl({
  src: ['assets/audio/car-engine-3.mp3'],
  autoplay: false,
  loop: true,
  sprite: {
    middle: [1 0, 100],
    end: [0,20]
  },
  volume: 0.9
});

let engine2 = new Howl({
  src: ['assets/audio/car-engine-2.mp3'],
  autoplay: false,
  loop: true,
  sprite: {
    middle: [10, 80],
    end: [0,20]
  },
  volume: 0.8
});

let dynEngine1 = engine1.play('middle');
let dynEngine2 = engine2.play('middle');
engine1.rate(0.9, dynEngine1);
engine2.rate(1.1, dynEngine2);