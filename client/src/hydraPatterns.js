// Collection of Hydra visual patterns
// Each pattern is a function that takes userParams and returns a Hydra visualization chain

export const hydraPatterns = [
  // Original complex pattern
  {
    name: "Complex Oscillator",
    pattern: (userParams) => {
      let visualization = osc(100,-0.0018,0.17).diff(osc(20,0.00008).rotate(Math.PI/0.00003))
        .modulateScale(noise(1.5,0.18).modulateScale(osc(13).rotate(()=>Math.sin(time/22))),3)
        .color(11,0.5,0.4, 0.9, 0.2, 0.011, 5, 22,  0.5, -1).contrast(1.4)
        .invert().brightness(0.0003, 2).contrast( 0.5, 2, 0.1, 2).color(4, -2, 0.1)
        .modulateScale(osc(2),-0.2, 2, 1, 0.3)
        .posterize(200) .rotate(1, 0.2, 0.01, 0.001)
        .color(22, -2, 0.5, 0.5, 0.0001,  0.1, 0.2, 8).contrast(0.18, 0.3, 0.1, 0.2, 0.03, 1).brightness(0.0001, -1, 10);
      return visualization;
    }
  },
  
  // New pattern provided by user
  {
    name: "Modulated Noise",
    pattern: (userParams) => {
      let visualization = osc(5,.1).modulate(noise(6),.22).diff(o0)
        .modulateScrollY(osc(2).modulate(osc().rotate(),.11))
        .scale(.72).color(0.99,1.014,1);
      return visualization;
    }
  },
  
  // Additional interesting patterns
  {
    name: "Kaleidoscope",
    pattern: (userParams) => {
      let visualization = osc(10, 0.1, 0.8)
        .color(0.9, 0.7, 0.8)
        .rotate(0.15)
        .modulate(osc(2, 0.5))
        .kaleid(6)
        .color(1.5, 0.7, 0.4);
      return visualization;
    }
  },
  
  {
    name: "Liquid Metal",
    pattern: (userParams) => {
      let visualization = osc(60, 0.1, 1.5)
        .modulate(noise(2.5, 0.1), 0.1)
        .diff(osc(20, 0.1).rotate(Math.PI/2))
        .modulateScale(osc(10, 0.5), 0.2)
        .color(0.2, 0.5, 1.2)
        .contrast(1.5);
      return visualization;
    }
  },
  
  {
    name: "Plasma Flow",
    pattern: (userParams) => {
      let visualization = noise(3, 0.1)
        .rotate(() => time * 0.1)
        .mult(osc(10, 0.1, 2).modulate(noise(4, 0.3), 0.6))
        .color(1.2, 0.8, 0.2)
        .contrast(1.8)
        .brightness(0.2);
      return visualization;
    }
  },
  
  {
    name: "Digital Rain",
    pattern: (userParams) => {
      let visualization = osc(30, 0.01, 0.1)
        .mult(noise(2, 0.5))
        .modulateScrollY(osc(0.1, 0.5), 0.1)
        .posterize(10)
        .color(0.1, 1.5, 0.2)
        .contrast(2);
      return visualization;
    }
  },
  
  {
    name: "Cosmic Waves",
    pattern: (userParams) => {
      let visualization = osc(4, 0.1, 0.8)
        .color(0.8, 0.4, 1.2)
        .diff(osc(8, 0.05).color(1.2, 0.2, 0.8))
        .modulate(noise(1, 0.2), 0.1)
        .kaleid(3)
        .rotate(() => time * 0.02);
      return visualization;
    }
  },
  
  {
    name: "Fractal Tunnel",
    pattern: (userParams) => {
      let visualization = osc(20, 0.05, 1.2)
        .modulateScale(osc(8).rotate(Math.PI/4), 0.3)
        .color(1.5, 0.3, 0.7)
        .diff(osc(40, 0.02).color(0.3, 1.2, 0.8))
        .kaleid(4)
        .contrast(1.6);
      return visualization;
    }
  }
];

// Function to get a random pattern
export const getRandomPattern = () => {
  const randomIndex = Math.floor(Math.random() * hydraPatterns.length);
  return hydraPatterns[randomIndex];
};

// Function to apply user parameters to any pattern
export const applyUserParameters = (visualization, userParams) => {
  // Apply brightness adjustment (0 = very dark, 50 = normal, 100 = very bright)
  const brightnessAdjust = (userParams.brightness - 50) / 50; // -1 to 1 range
  visualization = visualization.brightness(brightnessAdjust);
  
  // Only apply pixelate if value > 0
  if (userParams.pixelate > 0) {
    const pixelateAmount = Math.max(1, Math.floor((101 - userParams.pixelate) / 2)); // 1 to 50
    visualization = visualization.pixelate(pixelateAmount, pixelateAmount);
  }
  
  // Apply color inversion if value > 0
  if (userParams.invert > 0) {
    const invertAmount = userParams.invert / 100; // 0 to 1
    visualization = visualization.invert(invertAmount);
  }
  
  return visualization;
};