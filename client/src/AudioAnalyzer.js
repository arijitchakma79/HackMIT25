class AudioAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.source = null;
    this.isAnalyzing = false;
    this.audioElement = null;
    
    // Analysis data
    this.bassData = [];
    this.midData = [];
    this.trebleData = [];
    this.tempoData = [];
    this.lastBeatTime = 0;
    this.beatInterval = 500; // Default tempo
    
    // Frequency ranges
    this.bassRange = [20, 250];
    this.midRange = [250, 4000];
    this.trebleRange = [4000, 20000];
  }

  async initialize(audioElement) {
    try {
      this.audioElement = audioElement;
      
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create analyser
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Create source from audio element
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      // Create data array
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      console.log('Audio analyzer initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
      return false;
    }
  }

  startAnalysis(callback) {
    if (!this.analyser || this.isAnalyzing) return;
    
    this.isAnalyzing = true;
    
    const analyze = () => {
      if (!this.isAnalyzing) return;
      
      // Get frequency data
      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Calculate frequency bands
      const bass = this.getFrequencyBandAverage(this.bassRange);
      const mid = this.getFrequencyBandAverage(this.midRange);
      const treble = this.getFrequencyBandAverage(this.trebleRange);
      
      // Detect tempo/beats
      const tempo = this.detectTempo(bass);
      
      // Determine mood (simple heuristic)
      const mood = this.analyzeMood(bass, mid, treble);
      
      // Calculate overall intensity
      const intensity = (bass + mid + treble) / 3;
      
      // Store historical data for preprocessing
      this.bassData.push(bass);
      this.midData.push(mid);
      this.trebleData.push(treble);
      
      // Keep only last 100 samples for performance
      if (this.bassData.length > 100) {
        this.bassData.shift();
        this.midData.shift();
        this.trebleData.shift();
      }
      
      // Call callback with analysis data
      callback({
        bass: bass / 255, // Normalize to 0-1
        mid: mid / 255,
        treble: treble / 255,
        tempo,
        mood,
        intensity: intensity / 255
      });
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  }

  stopAnalysis() {
    this.isAnalyzing = false;
  }

  getFrequencyBandAverage(range) {
    const [minFreq, maxFreq] = range;
    const sampleRate = this.audioContext.sampleRate;
    const fftSize = this.analyser.fftSize;
    
    const minIndex = Math.floor(minFreq * fftSize / sampleRate);
    const maxIndex = Math.floor(maxFreq * fftSize / sampleRate);
    
    let sum = 0;
    let count = 0;
    
    for (let i = minIndex; i <= maxIndex && i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
      count++;
    }
    
    return count > 0 ? sum / count : 0;
  }

  detectTempo(bassLevel) {
    const now = Date.now();
    const threshold = 150; // Adjust based on testing
    
    if (bassLevel > threshold && now - this.lastBeatTime > 200) {
      const interval = now - this.lastBeatTime;
      this.beatInterval = interval;
      this.lastBeatTime = now;
    }
    
    // Convert interval to BPM
    return this.beatInterval > 0 ? 60000 / this.beatInterval : 120;
  }

  analyzeMood(bass, mid, treble) {
    // Simple mood detection heuristic
    // Higher treble/mid ratio suggests brighter, happier music
    // Higher bass suggests darker, more intense music
    
    const brightness = (mid + treble) / 2;
    const darkness = bass;
    
    return brightness > darkness ? 'happy' : 'dark';
  }

  // Preprocessing method for initial song analysis
  async preprocessSong(duration = 30) {
    return new Promise((resolve) => {
      const samples = [];
      let sampleCount = 0;
      const maxSamples = Math.floor(duration * 10); // Sample every 100ms for duration
      
      const preprocess = () => {
        if (sampleCount >= maxSamples) {
          // Calculate averages and patterns
          const avgBass = samples.reduce((sum, s) => sum + s.bass, 0) / samples.length;
          const avgMid = samples.reduce((sum, s) => sum + s.mid, 0) / samples.length;
          const avgTreble = samples.reduce((sum, s) => sum + s.treble, 0) / samples.length;
          
          // Detect dominant mood
          const happyCount = samples.filter(s => s.mood === 'happy').length;
          const dominantMood = happyCount > samples.length / 2 ? 'happy' : 'dark';
          
          // Calculate average tempo
          const avgTempo = samples.reduce((sum, s) => sum + s.tempo, 0) / samples.length;
          
          resolve({
            bass: avgBass,
            mid: avgMid,
            treble: avgTreble,
            tempo: avgTempo,
            mood: dominantMood,
            intensity: (avgBass + avgMid + avgTreble) / 3
          });
          return;
        }
        
        if (this.analyser) {
          this.analyser.getByteFrequencyData(this.dataArray);
          
          const bass = this.getFrequencyBandAverage(this.bassRange) / 255;
          const mid = this.getFrequencyBandAverage(this.midRange) / 255;
          const treble = this.getFrequencyBandAverage(this.trebleRange) / 255;
          const tempo = this.detectTempo(bass * 255);
          const mood = this.analyzeMood(bass * 255, mid * 255, treble * 255);
          
          samples.push({ bass, mid, treble, tempo, mood });
          sampleCount++;
        }
        
        setTimeout(preprocess, 100);
      };
      
      preprocess();
    });
  }

  destroy() {
    this.stopAnalysis();
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default AudioAnalyzer;