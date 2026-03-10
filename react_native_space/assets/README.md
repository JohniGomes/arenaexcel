# Excelino Mascot Animated GIFs

## Overview
This folder contains 4 animated GIF images of **Excelino**, the cute tiger mascot for the Arena Excel mobile app - a gamified Excel learning platform.

## Character Design
- **Style**: Cute, friendly cartoon tiger in chibi/kawaii style
- **Features**: Big expressive eyes, rounded proportions, orange tiger stripes
- **Outfit**: Vibrant green hoodie (#58CC02 - Duolingo-style green) with Excel/spreadsheet icon
- **Accessory**: Holding a tablet or phone with Excel logo
- **Expression**: Warm, welcoming, and encouraging

## Files Created

### 1. excelino-welcome.gif
- **Purpose**: Login, signup, onboarding screens
- **Animation**: Tiger waving hello with one paw, gentle bouncing/swaying
- **Expression**: Friendly smile
- **Size**: 400x400px (208KB)
- **Loop**: Infinite, ~2-3 seconds per cycle

### 2. excelino-celebrating.gif
- **Purpose**: Achievements, lesson complete screens
- **Animation**: Tiger jumping with joy, arms raised, confetti/sparkles around
- **Expression**: Excited and happy
- **Size**: 400x400px (176KB)
- **Loop**: Infinite, ~2-3 seconds per cycle

### 3. excelino-thinking.gif
- **Purpose**: Quiz/exercise screens
- **Animation**: Tiger with paw on chin, slight head tilt
- **Expression**: Curious and focused
- **Size**: 400x400px (192KB)
- **Loop**: Infinite, ~2-3 seconds per cycle

### 4. excelino-cheering.gif
- **Purpose**: Motivation, encouragement screens
- **Animation**: Tiger with fist pump gesture, energetic pose
- **Expression**: Determined and motivating
- **Size**: 400x400px (240KB)
- **Loop**: Infinite, ~2-3 seconds per cycle

## Technical Specifications
- **Format**: GIF (Graphics Interchange Format)
- **Dimensions**: 400x400 pixels (square, 1:1 aspect ratio)
- **Color Depth**: 8-bit, 256 colors
- **Optimization**: Optimized with gifsicle for mobile performance
- **Background**: White background
- **File Sizes**: 176KB - 240KB (optimized for mobile)

## Usage in React Native
```javascript
import { Image } from 'react-native';

// Example usage
<Image 
  source={require('./assets/excelino-welcome.gif')} 
  style={{ width: 200, height: 200 }}
/>
```

## Animation Details
Each animation consists of 4 frames that create a smooth looping effect:
- Frame 0: Starting pose
- Frame 1: Mid-motion (peak of movement)
- Frame 2: Return motion
- Frame 3: Back to Frame 1 (for smooth loop)
- Delay: 25/100 seconds per frame (~10 FPS)

## Brand Consistency
The mascot maintains consistent character design across all animations:
- Same tiger appearance and proportions
- Consistent green hoodie color (#58CC02)
- Same Excel branding elements
- Unified art style and quality

---
**Created**: February 15, 2026
**For**: Arena Excel Mobile App
**Character**: Excelino the Tiger Mascot
