#!/bin/bash

echo "🌱 Starting Crop Recommendation System..."
echo "========================================"

# Check if model files exist
if [ ! -f "crop_recommendation_model.pkl" ]; then
    echo "❌ Error: crop_recommendation_model.pkl not found!"
    echo "Please place your trained Random Forest model file in this directory."
    exit 1
fi

if [ ! -f "label_encoder.pkl" ]; then
    echo "❌ Error: label_encoder.pkl not found!"
    echo "Please place your LabelEncoder file in this directory."
    exit 1
fi

# Check if Python dependencies are installed
echo "📦 Checking dependencies..."
python3 -c "import flask, numpy, sklearn" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Installing dependencies..."
    pip3 install -r requirements.txt
fi

echo "🚀 Starting Flask server..."
echo "Backend will be available at: http://localhost:5000"
echo "Frontend: Open frontend/index.html in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask server
python3 app.py
