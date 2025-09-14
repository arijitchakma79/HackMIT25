// Collection of Hydra visual patterns
// Each pattern is a function that takes userParams and returns a Hydra visualization chain

// Seizure Safety Configuration
const SEIZURE_SAFETY = {
  MAX_FLASH_RATE: 3,        // Hz - Maximum flashes per second (safe limit is 3Hz)
  MIN_OSCILLATOR_FREQ: 0.1, // Minimum oscillator frequency to prevent rapid flashing
  MAX_OSCILLATOR_FREQ: 8,   // Maximum oscillator frequency (safe limit)
  MIN_SPEED: 0.01,          // Minimum animation speed
  MAX_SPEED: 0.3,           // Maximum animation speed to prevent rapid movement
  MAX_CONTRAST_CHANGE: 0.5, // Maximum contrast change rate
  MIN_PATTERN_DURATION: 2   // Minimum seconds between pattern changes
};

// Seeded random number generator for consistent randomness
class SeededRandom {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  // Linear congruential generator algorithm
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % (2 ** 32);
    return this.seed / (2 ** 32);
  }
  
  // Reset to original seed
  reset(newSeed) {
    this.seed = newSeed || 12345;
  }
  
  // Random float between min and max
  range(min, max) {
    return min + this.next() * (max - min);
  }
  
  // Random integer between min and max (inclusive)
  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
  
  // Random choice from array
  choice(array) {
    return array[this.int(0, array.length - 1)];
  }
}

// Seizure safety utility functions
const seizureSafety = {
  // Clamp frequency to safe range
  safeFrequency: (freq) => {
    return Math.max(SEIZURE_SAFETY.MIN_OSCILLATOR_FREQ, 
           Math.min(SEIZURE_SAFETY.MAX_OSCILLATOR_FREQ, freq));
  },
  
  // Clamp speed to safe range
  safeSpeed: (speed) => {
    return Math.max(SEIZURE_SAFETY.MIN_SPEED,
           Math.min(SEIZURE_SAFETY.MAX_SPEED, speed));
  },
  
  // Smooth oscillator parameters to prevent sharp changes
  smoothOscillator: (freq, sync, offset) => {
    const safeFreq = seizureSafety.safeFrequency(freq);
    const safeSync = Math.max(-0.1, Math.min(0.1, sync)); // Limit sync range
    const safeOffset = Math.max(0, Math.min(2, offset)); // Limit offset range
    
    return { freq: safeFreq, sync: safeSync, offset: safeOffset };
  },
  
  // Validate pattern for seizure safety
  validatePattern: (pattern) => {
    // Check for potentially unsafe patterns
    const warnings = [];
    
    // Check for high frequency oscillators
    const oscMatches = pattern.match(/osc\(([^,)]+)/g);
    if (oscMatches) {
      oscMatches.forEach(match => {
        const freq = parseFloat(match.match(/osc\(([^,)]+)/)[1]);
        if (freq > SEIZURE_SAFETY.MAX_OSCILLATOR_FREQ) {
          warnings.push(`High frequency oscillator detected: ${freq}Hz`);
        }
      });
    }
    
    // Check for fast rotation
    const rotateMatches = pattern.match(/rotate\(([^)]+)\)/g);
    if (rotateMatches) {
      rotateMatches.forEach(match => {
        const speed = parseFloat(match.match(/rotate\(([^)]+)\)/)[1]);
        if (speed > SEIZURE_SAFETY.MAX_SPEED) {
          warnings.push(`Fast rotation detected: ${speed}`);
        }
      });
    }
    
    return {
      isSafe: warnings.length === 0,
      warnings: warnings
    };
  }
};

// Global seeded random instance
let seededRandom = new SeededRandom();

// Function to set the seed for consistent patterns
export const setSeed = (seed) => {
  seededRandom.reset(seed);
};

// Function to get seeded random (replacement for Math.random())
export const getRandom = () => seededRandom.next();

// Procedural color generation using color theory
export const proceduralColorGenerator = {
  // Convert HSL to RGB for color generation
  hslToRgb: (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    return {
      r: ((r + m) * 2.5).toFixed(3), // Increased scale from 2 to 2.5 for brighter colors
      g: ((g + m) * 2.5).toFixed(3),
      b: ((b + m) * 2.5).toFixed(3)
    };
  },
  
  // Generate complementary colors (opposite on color wheel)
  generateComplementary: () => {
    const baseHue = getRandom() * 360;
    const saturation = 45 + getRandom() * 35; // 45-80%
    const lightness = 55 + getRandom() * 30;  // Increased from 45-70% to 55-85%
    
    return proceduralColorGenerator.hslToRgb(baseHue, saturation, lightness);
  },
  
  // Generate triadic colors (120° apart on color wheel)
  generateTriadic: () => {
    const baseHue = getRandom() * 360;
    const saturation = 40 + getRandom() * 35; // 40-75%
    const lightness = 50 + getRandom() * 35;  // Increased from 40-70% to 50-85%
    
    const hueOffset = 120 + (getRandom() - 0.5) * 20; // 110-130°
    const secondHue = (baseHue + hueOffset) % 360;
    
    return proceduralColorGenerator.hslToRgb(secondHue, saturation, lightness);
  },
  
  // Generate analogous colors (adjacent on color wheel)
  generateAnalogous: () => {
    const baseHue = getRandom() * 360;
    const saturation = 35 + getRandom() * 40; // 35-75%
    const lightness = 50 + getRandom() * 35;  // Increased from 35-75% to 50-85%
    
    const hueOffset = 15 + getRandom() * 45; // 15-60°
    const direction = getRandom() > 0.5 ? 1 : -1;
    const analogousHue = (baseHue + (hueOffset * direction) + 360) % 360;
    
    return proceduralColorGenerator.hslToRgb(analogousHue, saturation, lightness);
  },
  
  // Generate tetradic colors (rectangle on color wheel)
  generateTetradic: () => {
    const baseHue = getRandom() * 360;
    const saturation = 45 + getRandom() * 30; // 45-75%
    const lightness = 55 + getRandom() * 30;  // Increased from 40-70% to 55-85%
    
    const offset1 = 60 + getRandom() * 30;  // 60-90°
    const offset2 = 180 + getRandom() * 20; // 180-200°
    const hueVariant = (baseHue + offset1 + offset2) % 360;
    
    return proceduralColorGenerator.hslToRgb(hueVariant, saturation, lightness);
  },
  
  // Generate monochromatic variations (same hue, different saturation/lightness)
  generateMonochromatic: () => {
    const baseHue = getRandom() * 360;
    const saturation = 25 + getRandom() * 50; // 25-75%
    const lightness = 50 + getRandom() * 35;  // Increased from 35-75% to 50-85%
    
    return proceduralColorGenerator.hslToRgb(baseHue, saturation, lightness);
  },
  
  // Generate split-complementary colors
  generateSplitComplementary: () => {
    const baseHue = getRandom() * 360;
    const saturation = 40 + getRandom() * 35; // 40-75%
    const lightness = 50 + getRandom() * 35;  // Increased from 40-70% to 50-85%
    
    const splitAngle = 150 + getRandom() * 60; // 150-210°
    const splitHue = (baseHue + splitAngle) % 360;
    
    return proceduralColorGenerator.hslToRgb(splitHue, saturation, lightness);
  },
  
  // Enhance contrast for better pattern visibility
  enhanceContrast: (color) => {
    // Convert back to numbers for processing
    let r = parseFloat(color.r);
    let g = parseFloat(color.g);
    let b = parseFloat(color.b);
    
    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // If color is too dark, brighten it significantly
    if (luminance < 0.8) {
      // Too dark - brighten it more aggressively
      r = Math.min(r * 1.8, 2.5); // Increased multiplier and cap
      g = Math.min(g * 1.8, 2.5);
      b = Math.min(b * 1.8, 2.5);
    } else if (luminance > 2.0) {
      // Too bright - tone it down slightly
      r = Math.max(r * 0.8, 0.5); // Less aggressive reduction
      g = Math.max(g * 0.8, 0.5);
      b = Math.max(b * 0.8, 0.5);
    }
    
    // Ensure minimum brightness
    r = Math.max(r, 0.3);
    g = Math.max(g, 0.3);
    b = Math.max(b, 0.3);
    
    return {
      r: r.toFixed(3),
      g: g.toFixed(3),
      b: b.toFixed(3)
    };
  }
};

// Function to get procedurally generated harmonious colors
export const getRandomColors = () => {
  const colorSchemes = [
    proceduralColorGenerator.generateComplementary,
    proceduralColorGenerator.generateTriadic,
    proceduralColorGenerator.generateAnalogous,
    proceduralColorGenerator.generateTetradic,
    proceduralColorGenerator.generateMonochromatic,
    proceduralColorGenerator.generateSplitComplementary
  ];
  
  const randomScheme = colorSchemes[Math.floor(getRandom() * colorSchemes.length)];
  const generatedColor = randomScheme();
  
  // Apply contrast enhancement to avoid extreme colors
  return proceduralColorGenerator.enhanceContrast(generatedColor);
};

// Legacy function for compatibility - now uses procedural generation
export const getRandomColorPalette = () => {
  // Return a procedurally generated color as if it were a palette
  const color = getRandomColors();
  return {
    r: [parseFloat(color.r)],
    g: [parseFloat(color.g)],
    b: [parseFloat(color.b)]
  };
};

// Procedural Content Generation for Hydra Patterns
export const proceduralGenerator = {
  // Random parameter generators influenced by user parameters
  randomOscParams: (userParams = {}) => {
    const baseFreq = getRandom() * 6 + 0.5; // Reduced from 100+1 to 6+0.5 for safety
    // Higher pixelate values favor higher frequencies for more detail
    const pixelateInfluence = (userParams.pixelate || 0) / 100;
    const freq = baseFreq + (pixelateInfluence * 2); // Reduced influence for safety
    
    // Apply seizure safety limits
    const safeParams = seizureSafety.smoothOscillator(
      freq,
      (getRandom() - 0.5) * 0.1, // Reduced from 0.3 to 0.1 for stability
      getRandom() * 2             // Reduced from 4 to 2 for safety
    );
    
    return safeParams;
  },
  
  randomNoiseParams: (userParams = {}) => {
    const baseScale = getRandom() * 10 + 0.5;
    // Brightness affects noise scale - dimmer = finer noise
    const brightnessInfluence = (userParams.brightness || 50) / 100;
    const scale = baseScale * (0.5 + brightnessInfluence); // More brightness = larger noise
    
    return {
      scale: scale,
      offset: getRandom() * 1.5  // Increased from 0.5 to 1.5 for more movement
    };
  },
  
  randomModulateParams: (userParams = {}) => {
    const baseAmount = getRandom() * 0.8 + 0.2; // Increased base range for more modulation
    // Invert parameter affects modulation intensity
    const invertInfluence = (userParams.invert || 0) / 100;
    const amount = baseAmount + (invertInfluence * 0.5); // Increased influence for more movement
    
    return {
      amount: Math.min(amount, 1.2) // Increased cap from 0.8 to 1.2
    };
  },
  
  randomColorParams: (colors, userParams = {}) => {
    const brightnessInfluence = (userParams.brightness || 50) / 100;
    const invertInfluence = (userParams.invert || 0) / 100;
    
    // More conservative color multiplication to avoid extremes but ensure brightness
    const colorMultiplier = getRandom() * 1.0 + 0.8; // 0.8-1.8 for brighter baseline
    
    return {
      r: colors.r * colorMultiplier * (0.8 + brightnessInfluence * 0.4), // Increased baseline from 0.6 to 0.8
      g: colors.g * colorMultiplier * (0.8 + brightnessInfluence * 0.4),
      b: colors.b * colorMultiplier * (0.8 + brightnessInfluence * 0.4 * (1 - invertInfluence * 0.3))
    };
  },
  
  // Pattern building blocks influenced by user parameters
  generateSource: (colors, userParams = {}) => {
    const choice = getRandom();
    const oscParams = proceduralGenerator.randomOscParams(userParams);
    const noiseParams = proceduralGenerator.randomNoiseParams(userParams);
    
    // Higher pixelate values favor more geometric sources
    const pixelateInfluence = (userParams.pixelate || 0) / 100;
    const geometricBias = pixelateInfluence * 0.3; // Increase geometric source probability
    
    if (choice < (0.35 + geometricBias)) {
      return `osc(${oscParams.freq.toFixed(2)}, ${oscParams.sync.toFixed(4)}, ${oscParams.offset.toFixed(2)})`;
    } else if (choice < (0.6 - geometricBias/2)) {
      return `noise(${noiseParams.scale.toFixed(2)}, ${noiseParams.offset.toFixed(2)})`;
    } else if (choice < 0.75) {
      // Enhanced voronoi with safe speed parameters
      const scale = (getRandom() * 15 + 2).toFixed(2); // Increased from 10+1 to 15+2
      const rawSpeed = getRandom() * 0.5 + 0.02; // Reduced max speed for safety
      const speed = seizureSafety.safeSpeed(rawSpeed).toFixed(3);
      const blending = (getRandom() * 3).toFixed(2); // Increased blending range
      return `voronoi(${scale}, ${speed}, ${blending})`;
    } else if (choice < (0.85 + geometricBias)) {
      // Higher frequency shape generation - increased radius and frequency ranges
      const sides = Math.floor(getRandom() * 12) + 3; // 3-14 sides for more variety
      const radius = (getRandom() * 1.5 + 0.2).toFixed(3); // 0.2-1.7 range for bigger shapes
      const smoothness = (getRandom() * 0.8 + 0.1).toFixed(3); // 0.1-0.9 range for more variation
      return `shape(${sides}, ${radius}, ${smoothness})`;
    } else if (choice < 0.95) {
      return `gradient(${(getRandom()).toFixed(2)})`;
    } else {
      return `solid(${colors.r.toFixed(2)}, ${colors.g.toFixed(2)}, ${colors.b.toFixed(2)})`;
    }
  },
  
  generateModulation: (userParams = {}) => {
    const choice = getRandom();
    const modulateParams = proceduralGenerator.randomModulateParams(userParams);
    const amount = modulateParams.amount.toFixed(3);
    
    // Invert parameter influences modulation type preference
    const invertInfluence = (userParams.invert || 0) / 100;
    
    if (choice < (0.15 + invertInfluence * 0.15)) {
      const params = proceduralGenerator.randomOscParams(userParams);
      return `.modulate(osc(${params.freq.toFixed(1)}), ${amount})`;
    } else if (choice < 0.3) {
      const params = proceduralGenerator.randomNoiseParams(userParams);
      return `.modulate(noise(${params.scale.toFixed(1)}), ${amount})`;
    } else if (choice < 0.45) {
      const safeFreq = seizureSafety.safeFrequency(getRandom() * 6 + 0.5); // Reduced from 30+2
      return `.modulateScale(osc(${safeFreq.toFixed(1)}), ${amount})`;
    } else if (choice < 0.6) {
      const safeFreq = seizureSafety.safeFrequency(getRandom() * 4 + 0.5); // Reduced from 20+1
      return `.modulateRotate(osc(${safeFreq.toFixed(1)}), ${amount})`;
    } else if (choice < 0.75) {
      const safeFreq = seizureSafety.safeFrequency(getRandom() * 3 + 0.5); // Reduced from 15+1
      return `.modulateScrollX(osc(${safeFreq.toFixed(1)}), ${amount})`;
    } else if (choice < 0.9) {
      const safeFreq = seizureSafety.safeFrequency(getRandom() * 3 + 0.5); // Reduced from 15+1
      return `.modulateScrollY(osc(${safeFreq.toFixed(1)}), ${amount})`;
    } else {
      const safeFreq = seizureSafety.safeFrequency(getRandom() * 2 + 0.5); // Reduced from 10+0.5
      return `.modulateHue(osc(${safeFreq.toFixed(1)}), ${amount})`;
    }
  },
  
  generateGeometry: (userParams = {}) => {
    const choice = getRandom();
    const pixelateInfluence = (userParams.pixelate || 0) / 100;
    const brightnessInfluence = (userParams.brightness || 50) / 100;
    
    // Pixelate parameter influences geometric transformation preferences
    if (choice < (0.15 + pixelateInfluence * 0.2)) {
      const sides = Math.floor(getRandom() * 10) + 3; // 3-12 sides
      return `.kaleid(${sides})`;
    } else if (choice < 0.3) {
      const amount = (getRandom() * 2 + 0.3).toFixed(2);
      return `.scale(${amount})`;
    } else if (choice < (0.45 + brightnessInfluence * 0.1)) {
      const rawSpeed = getRandom() * 0.2 + 0.02; // Reduced max rotation speed for safety
      const speed = seizureSafety.safeSpeed(rawSpeed).toFixed(4);
      return `.rotate(${speed})`;
    } else if (choice < 0.6) {
      const amount = Math.floor(getRandom() * 30) + 3; // 3-32
      return `.posterize(${amount})`;
    } else if (choice < (0.75 + pixelateInfluence * 0.15)) {
      // More likely to add pixelate when user has high pixelate value
      const amount = Math.floor(getRandom() * 8) + 2; // 2-9
      return `.pixelate(${amount}, ${amount})`;
    } else if (choice < 0.85) {
      const repeatX = Math.floor(getRandom() * 4) + 1; // 1-4
      const repeatY = Math.floor(getRandom() * 4) + 1; // 1-4
      return `.repeat(${repeatX}, ${repeatY})`;
    } else if (choice < 0.95) {
      return `.invert()`;
    } else {
      const threshold = (getRandom() * 0.8 + 0.1).toFixed(2);
      return `.thresh(${threshold})`;
    }
  },
  
  generateBlending: (colors, userParams = {}) => {
    const choice = getRandom();
    const invertInfluence = (userParams.invert || 0) / 100;
    
    // Higher invert values favor more complex blending
    if (choice < (0.4 - invertInfluence * 0.1)) {
      const secondary = proceduralGenerator.generateSource(colors, userParams);
      return `.diff(${secondary})`;
    } else if (choice < (0.7 + invertInfluence * 0.1)) {
      const secondary = proceduralGenerator.generateSource(colors, userParams);
      return `.mult(${secondary})`;
    } else {
      const secondary = proceduralGenerator.generateSource(colors, userParams);
      return `.add(${secondary})`;
    }
  },
  
  // Main procedural pattern generator with user parameter influence
  generatePattern: (colors, complexity = 'medium', userParams = {}) => {
    let pattern = proceduralGenerator.generateSource(colors, userParams);
    
    // Adjust complexity levels based on user parameters
    const pixelateInfluence = (userParams.pixelate || 0) / 100;
    const brightnessInfluence = (userParams.brightness || 50) / 100;
    const invertInfluence = (userParams.invert || 0) / 100;
    
    // User parameters can influence complexity
    const complexityMultiplier = 1 + (pixelateInfluence * 0.5) + (invertInfluence * 0.3);
    
    const baseLevels = {
      simple: { modulations: 1, geometries: 1, blendings: 0 },
      medium: { modulations: 2, geometries: 2, blendings: 1 },
      complex: { modulations: 3, geometries: 3, blendings: 2 }
    };
    
    const level = baseLevels[complexity] || baseLevels.medium;
    
    // Scale complexity based on user input
    const scaledLevel = {
      modulations: Math.ceil(level.modulations * complexityMultiplier),
      geometries: Math.ceil(level.geometries * complexityMultiplier),
      blendings: Math.ceil(level.blendings * complexityMultiplier)
    };
    
    // Add modulations
    for (let i = 0; i < scaledLevel.modulations; i++) {
      if (getRandom() < (0.7 + invertInfluence * 0.2)) {
        pattern += proceduralGenerator.generateModulation(userParams);
      }
    }
    
    // Add blending operations
    for (let i = 0; i < scaledLevel.blendings; i++) {
      if (getRandom() < (0.5 + invertInfluence * 0.3)) {
        pattern += proceduralGenerator.generateBlending(colors, userParams);
      }
    }
    
    // Add geometric transformations
    for (let i = 0; i < scaledLevel.geometries; i++) {
      if (getRandom() < (0.8 + pixelateInfluence * 0.15)) {
        pattern += proceduralGenerator.generateGeometry(userParams);
      }
    }
    
    // Add final color adjustment influenced by user parameters
    const colorParams = proceduralGenerator.randomColorParams(colors, userParams);
    pattern += `.color(${colorParams.r.toFixed(3)}, ${colorParams.g.toFixed(3)}, ${colorParams.b.toFixed(3)})`;
    
    return pattern;
  }
};

// Function to get a random pattern - now purely procedural and user-influenced
export const getRandomPattern = (userParams = { pixelate: 0, brightness: 50, invert: 5 }) => {
  // Always generate a new procedural pattern influenced by user parameters
  const complexities = ['simple', 'medium', 'complex'];
  const randomComplexity = complexities[Math.floor(getRandom() * complexities.length)];
  return generateProceduralPattern(randomComplexity, userParams);
};

// Function to generate a completely new procedural pattern
export const generateProceduralPattern = (complexity = 'medium', userParams = { pixelate: 0, brightness: 50, invert: 5 }) => {
  const randomColors = getRandomColors();
  
  // Enhanced pattern generation with more variety and user influence
  const generateAdvancedPattern = (colors, complexity, userParams) => {
    let pattern = proceduralGenerator.generateSource(colors, userParams);
    
    const pixelateInfluence = userParams.pixelate / 100;
    const brightnessInfluence = userParams.brightness / 100;
    const invertInfluence = userParams.invert / 100;
    
    const complexityMultiplier = 1 + (pixelateInfluence * 0.4) + (invertInfluence * 0.3);
    
    const baseLevels = {
      simple: { modulations: 1, geometries: 2, blendings: 1, effects: 1 },
      medium: { modulations: 2, geometries: 3, blendings: 2, effects: 2 },
      complex: { modulations: 3, geometries: 4, blendings: 2, effects: 3 }
    };
    
    const level = baseLevels[complexity] || baseLevels.medium;
    
    // Scale effects based on user input
    const scaledLevel = {
      modulations: Math.min(Math.ceil(level.modulations * complexityMultiplier), 5),
      geometries: Math.min(Math.ceil(level.geometries * complexityMultiplier), 5),
      blendings: Math.min(Math.ceil(level.blendings * complexityMultiplier), 3),
      effects: Math.min(Math.ceil(level.effects * complexityMultiplier), 4)
    };
    
    // Add modulations
    for (let i = 0; i < scaledLevel.modulations; i++) {
      if (getRandom() < (0.8 + invertInfluence * 0.15)) {
        pattern += proceduralGenerator.generateModulation(userParams);
      }
    }
    
    // Add blending operations
    for (let i = 0; i < scaledLevel.blendings; i++) {
      if (getRandom() < (0.6 + invertInfluence * 0.2)) {
        pattern += proceduralGenerator.generateBlending(colors, userParams);
      }
    }
    
    // Add geometric transformations
    for (let i = 0; i < scaledLevel.geometries; i++) {
      if (getRandom() < (0.8 + pixelateInfluence * 0.15)) {
        pattern += proceduralGenerator.generateGeometry(userParams);
      }
    }
    
    // Add special effects influenced by user parameters
    for (let i = 0; i < scaledLevel.effects; i++) {
      if (getRandom() < 0.6) {
        const effects = [
          `.contrast(${(getRandom() * 2 + 0.5 + brightnessInfluence).toFixed(2)})`,
          `.brightness(${((getRandom() * 0.4 - 0.2) * brightnessInfluence).toFixed(3)})`,
          `.saturate(${(getRandom() * 2 + 0.5 + invertInfluence).toFixed(2)})`,
          `.hue(${(getRandom() * 0.5 * invertInfluence).toFixed(3)})`
        ];
        pattern += effects[Math.floor(getRandom() * effects.length)];
      }
    }
    
    // Add final color adjustment influenced by user parameters
    const colorParams = proceduralGenerator.randomColorParams(colors, userParams);
    pattern += `.color(${colorParams.r.toFixed(3)}, ${colorParams.g.toFixed(3)}, ${colorParams.b.toFixed(3)})`;
    
    return pattern;
  };
  
  const patternCode = generateAdvancedPattern(randomColors, complexity, userParams);
  
  // Validate pattern for seizure safety
  const validation = seizureSafety.validatePattern(patternCode);
  if (!validation.isSafe) {
    console.warn('Pattern safety warnings:', validation.warnings);
    // In a production app, you might want to regenerate the pattern or apply additional safety measures
  }
  
  return {
    name: `Procedural ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}`,
    pattern: (userParams, colors) => {
      try {
        return eval(patternCode.replace(/colors\./g, 'colors.'));
      } catch (error) {
        console.error('Error in procedural pattern:', error);
        // Fallback to simple, safe oscillator
        const safeFreq = seizureSafety.safeFrequency(2);
        return osc(safeFreq, 0.05, 0.8).color(colors.r, colors.g, colors.b);
      }
    },
    colors: randomColors,
    isProcedurallyGenerated: true,
    generatedCode: patternCode,
    influencedByUserParams: true,
    safetyValidation: validation
  };
};

// Legacy function - now just calls getRandomPattern for compatibility
export const getRandomPatternEnhanced = (userParams = { pixelate: 0, brightness: 50, invert: 5 }) => {
  return getRandomPattern(userParams);
};

// Function to apply user parameters to any pattern
export const applyUserParameters = (visualization, userParams) => {
  const brightnessMultiplier = userParams.brightness / 100; // 0.00 to 1.00
  visualization = visualization.color(brightnessMultiplier, brightnessMultiplier, brightnessMultiplier);
  
  if (userParams.pixelate > 0) {
    // More gradual pixelation scaling
    // At 0%: no pixelation
    // At 20%: pixelateAmount = 100 (very subtle)
    // At 50%: pixelateAmount = 50 (moderate)
    // At 100%: pixelateAmount = 5 (very pixelated)
    const pixelateAmount = Math.max(5, Math.floor(200 - (userParams.pixelate * 1.95)));
    visualization = visualization.pixelate(pixelateAmount, pixelateAmount);
  }
  
  if (userParams.invert > 0) {
    const invertAmount = userParams.invert / 100; // 0 to 1
    visualization = visualization.invert(invertAmount);
  }
  
  return visualization;
};