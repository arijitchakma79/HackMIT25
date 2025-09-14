// Collection of Hydra visual patterns
// Each pattern is a function that takes userParams and returns a Hydra visualization chain

// Color palettes for random color generation
export const colorPalettes = [
  // Warm palette
  { r: [1.5, 1.2, 0.8], g: [0.7, 0.5, 0.3], b: [0.4, 0.6, 0.2] },
  // Cool palette
  { r: [0.2, 0.5, 0.8], g: [0.7, 1.2, 1.5], b: [1.5, 1.0, 0.8] },
  // Purple/Pink palette
  { r: [1.5, 0.9, 1.2], g: [0.3, 0.6, 0.4], b: [1.4, 1.0, 1.6] },
  // Green/Nature palette
  { r: [0.2, 0.6, 0.4], g: [1.5, 1.2, 0.8], b: [0.3, 0.5, 0.7] },
  // Neon palette
  { r: [1.8, 0.1, 1.2], g: [0.2, 1.8, 0.5], b: [0.1, 0.3, 1.8] },
  // Sunset palette
  { r: [1.8, 1.4, 0.8], g: [0.8, 0.6, 0.3], b: [0.2, 0.4, 0.6] },
  // Ocean palette
  { r: [0.1, 0.3, 0.6], g: [0.6, 0.9, 1.2], b: [1.8, 1.4, 1.0] },
  // Monochrome variations
  { r: [1.2, 0.8, 1.0], g: [1.2, 0.8, 1.0], b: [1.2, 0.8, 1.0] }
];

// Function to get random color values from a palette
export const getRandomColorPalette = () => {
  const randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return colorPalettes[randomIndex];
};

// Function to get random individual color values
export const getRandomColors = () => {
  const palette = getRandomColorPalette();
  return {
    r: palette.r[Math.floor(Math.random() * palette.r.length)],
    g: palette.g[Math.floor(Math.random() * palette.g.length)],
    b: palette.b[Math.floor(Math.random() * palette.b.length)]
  };
};

export const hydraPatterns = [
  // Original complex pattern
  {
    name: "Complex Oscillator",
    pattern: (userParams, colors) => {
      let visualization = osc(100,-0.0018,0.17).diff(osc(20,0.00008).rotate(Math.PI/0.00003))
        .modulateScale(noise(1.5,0.18).modulateScale(osc(13).rotate(()=>Math.sin(time/22))),3)
        .color(colors.r * 11, colors.g * 0.5, colors.b * 0.4, 0.9, 0.2, 0.011, 5, 22, 0.5, -1).contrast(1.4)
        .invert().brightness(0.0003, 2).contrast(0.5, 2, 0.1, 2).color(colors.r * 4, colors.g * -2, colors.b * 0.1)
        .modulateScale(osc(2),-0.2, 2, 1, 0.3)
        .posterize(200).rotate(1, 0.2, 0.01, 0.001)
        .color(colors.r * 22, colors.g * -2, colors.b * 0.5, 0.5, 0.0001, 0.1, 0.2, 8).contrast(0.18, 0.3, 0.1, 0.2, 0.03, 1).brightness(0.0001, -1, 10);
      return visualization;
    }
  },
  
  // New pattern provided by user
  {
    name: "Modulated Noise",
    pattern: (userParams, colors) => {
      let visualization = osc(5,.1).modulate(noise(6),.22).diff(o0)
        .modulateScrollY(osc(2).modulate(osc().rotate(),.11))
        .scale(.72).color(colors.r * 0.99, colors.g * 1.014, colors.b * 1);
      return visualization;
    }
  },
  
  // Additional interesting patterns
  {
    name: "Kaleidoscope",
    pattern: (userParams, colors) => {
      let visualization = osc(10, 0.1, 0.8)
        .color(colors.r * 0.9, colors.g * 0.7, colors.b * 0.8)
        .rotate(0.15)
        .modulate(osc(2, 0.5))
        .kaleid(6)
        .color(colors.r * 1.5, colors.g * 0.7, colors.b * 0.4);
      return visualization;
    }
  },
  
  {
    name: "Liquid Metal",
    pattern: (userParams, colors) => {
      let visualization = osc(60, 0.1, 1.5)
        .modulate(noise(2.5, 0.1), 0.1)
        .diff(osc(20, 0.1).rotate(Math.PI/2))
        .modulateScale(osc(10, 0.5), 0.2)
        .color(colors.r * 0.2, colors.g * 0.5, colors.b * 1.2)
        .contrast(1.5);
      return visualization;
    }
  },
  
  {
    name: "Plasma Flow",
    pattern: (userParams, colors) => {
      let visualization = noise(3, 0.1)
        .rotate(() => time * 0.1)
        .mult(osc(10, 0.1, 2).modulate(noise(4, 0.3), 0.6))
        .color(colors.r * 1.2, colors.g * 0.8, colors.b * 0.2)
        .contrast(1.8)
        .brightness(0.2);
      return visualization;
    }
  },
  
  {
    name: "Digital Rain",
    pattern: (userParams, colors) => {
      let visualization = osc(30, 0.01, 0.1)
        .mult(noise(2, 0.5))
        .modulateScrollY(osc(0.1, 0.5), 0.1)
        .posterize(10)
        .color(colors.r * 0.1, colors.g * 1.5, colors.b * 0.2)
        .contrast(2);
      return visualization;
    }
  },
  
  {
    name: "Cosmic Waves",
    pattern: (userParams, colors) => {
      let visualization = osc(4, 0.1, 0.8)
        .color(colors.r * 0.8, colors.g * 0.4, colors.b * 1.2)
        .diff(osc(8, 0.05).color(colors.r * 1.2, colors.g * 0.2, colors.b * 0.8))
        .modulate(noise(1, 0.2), 0.1)
        .kaleid(3)
        .rotate(() => time * 0.02);
      return visualization;
    }
  },
  
  {
    name: "Fractal Tunnel",
    pattern: (userParams, colors) => {
      let visualization = osc(20, 0.05, 1.2)
        .modulateScale(osc(8).rotate(Math.PI/4), 0.3)
        .color(colors.r * 1.5, colors.g * 0.3, colors.b * 0.7)
        .diff(osc(40, 0.02).color(colors.r * 0.3, colors.g * 1.2, colors.b * 0.8))
        .kaleid(4)
        .contrast(1.6);
      return visualization;
    }
  }
];

// Function to get a random pattern with random colors
export const getRandomPattern = () => {
  const randomIndex = Math.floor(Math.random() * hydraPatterns.length);
  const randomColors = getRandomColors();
  return {
    ...hydraPatterns[randomIndex],
    colors: randomColors
  };
};

// Function to apply user parameters to any pattern
export const applyUserParameters = (visualization, userParams) => {
  // Apply brightness as RGB multiplier (0 = black/0.00, 100 = full brightness/1.00)
  const brightnessMultiplier = userParams.brightness / 100; // 0.00 to 1.00
  visualization = visualization.color(brightnessMultiplier, brightnessMultiplier, brightnessMultiplier);
  
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