# Quick Start Guide

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## What You'll See

- A beautiful landing page with 6 model cards
- Click any model card to see its interactive visualization
- Each visualization includes:
  - Step-by-step explanations
  - Interactive controls (sliders, buttons)
  - Animated graphics
  - Real-time predictions
  - Model characteristics

## Features by Model

### 🔵 Logistic Regression
- Adjust feature weights and see probability change
- Interactive sigmoid curve
- Real-time prediction calculation

### 🟢 K-Nearest Neighbors
- Adjust K value to see how it affects predictions
- Visualize nearest neighbors in 2D space
- See distance-based voting

### 🟣 Random Forest
- Control number of trees
- See individual tree predictions
- Watch voting mechanism in action

### 🟠 XGBoost
- Adjust learning rate and number of trees
- See sequential tree building
- Watch training loss decrease

### 🩷 LightGBM
- Compare leaf-wise vs level-wise growth
- Understand GOSS and EFB optimizations
- See performance advantages

### 🔷 Ensemble Model
- Toggle between hard and soft voting
- Select which models to include
- See how ensemble improves predictions

## Troubleshooting

If you encounter issues:

1. **Port already in use:**
   - Change port: `npm run dev -- -p 3001`

2. **Module not found errors:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Build errors:**
   - Make sure you're using Node.js 18+
   - Check TypeScript version compatibility

## Next Steps

- Explore each model visualization
- Adjust parameters to see how they affect predictions
- Compare different models side-by-side
- Use this as a learning tool for understanding ML algorithms

Enjoy exploring machine learning! 🚀

