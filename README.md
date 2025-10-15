# 🌱 Crop Recommendation System

A full-stack web application that uses machine learning to recommend the best crops based on soil and climate conditions. The system uses a trained Random Forest Classifier with a LabelEncoder for crop name mapping.

## 🚀 Features

- **AI-Powered Predictions**: Uses a trained Random Forest model with LabelEncoder
- **Comprehensive Input Validation**: Validates all soil and climate parameters
- **Modern UI**: Clean, responsive design with Tailwind CSS
 - **Real-time Feedback**: Instant predictions with confidence scores
 - **Top-3 Suggestions**: Shows the two next-best crops in addition to the primary
 - **Adaptive Chart**: Responsive bar chart visualizing top-3 prediction confidences
- **Error Handling**: Robust error handling for invalid inputs and network issues

## 📋 Requirements

- Python 3.7+
- Flask
- scikit-learn
- numpy
- Your trained model files:
  - `crop_recommendation_model.pkl`
  - `label_encoder.pkl`

## 🛠️ Installation

### 1. Clone/Download the Project
```bash
# Navigate to your project directory
cd /path/to/your/project
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Add Your Model Files
Place your trained model files in the root directory (same level as `app.py`):
- `crop_recommendation_model.pkl` - Your trained Random Forest model
- `label_encoder.pkl` - Your LabelEncoder for crop name mapping

## 🚀 Running the Application

### Backend (Flask Server)
```bash
# Start the Flask server
python app.py
```

The server will start on `http://localhost:5000`

### Frontend
Open the `frontend/index.html` file in your web browser, or serve it using a local server:

```bash
# Option 1: Open directly in browser
open frontend/index.html

# Option 2: Serve with Python (if you have Python 3)
cd frontend
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📡 API Endpoints

### POST /predict
Predict crop recommendation based on input features.

**Request Body:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Response:**
```json
{
  "best_crop": "rice",
  "confidence": 95.2,
  "message": "Recommended crop: rice",
  "top_predictions": [
    { "crop": "rice", "probability": 95.2 },
    { "crop": "maize", "probability": 3.1 },
    { "crop": "wheat", "probability": 1.7 }
  ]
}
```

### GET /health
Check server health and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "label_encoder_loaded": true
}
```

### GET /
API documentation and usage information.

## 🎯 Input Parameters

| Parameter | Description | Range | Unit |
|-----------|-------------|-------|------|
| N | Nitrogen level in soil | 0-200 | mg/kg |
| P | Phosphorus level in soil | 0-200 | mg/kg |
| K | Potassium level in soil | 0-200 | mg/kg |
| temperature | Average temperature | -50 to 60 | °C |
| humidity | Relative humidity | 0-100 | % |
| ph | Soil pH level | 0-14 | - |
| rainfall | Annual rainfall | 0-1000 | mm |

### Units Guidance

- **N, P, K**: Enter nutrient concentration in mg/kg (ppm). Keep all three in the same unit.
- **Temperature**: Celsius (°C).
- **Humidity**: Percentage (%).
- **pH**: 0–14 scale.
- **Rainfall**: Millimeters (mm) per year.

If your soil report uses different units (e.g., kg/ha), convert to mg/kg before entering. Mixing units can distort predictions.

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Input Validation**: Client-side validation with helpful error messages
- **Loading States**: Visual feedback during API calls
- **Result Display**: Beautiful presentation of predictions with confidence scores
 - **Secondary Suggestions**: Displays two additional likely crops with probabilities
 - **Prediction Chart**: Adaptive Chart.js bar chart for top-3 confidences
- **Error Handling**: User-friendly error messages for various scenarios

## 🔧 Troubleshooting

### Common Issues

1. **"Models not loaded" error**
   - Ensure both `crop_recommendation_model.pkl` and `label_encoder.pkl` are in the same directory as `app.py`
   - Check that both model files are not corrupted

2. **"Cannot connect to backend" error**
   - Make sure the Flask server is running (`python app.py`)
   - Check that the server is running on `http://localhost:5000`
   - Ensure no firewall is blocking the connection

3. **"Missing required fields" error**
   - Fill in all form fields with valid numeric values
   - Check that values are within the specified ranges

4. **CORS errors**
   - The Flask app is configured to allow cross-origin requests
   - If you still get CORS errors, try serving the frontend from a local server

### Development Tips

- The Flask server runs in debug mode by default
- Check the terminal for detailed error messages
- Use the `/health` endpoint to verify both models are loaded
- The frontend includes connection status indicators

## 📁 Project Structure

```
crop-recommendation-system/
├── app.py                              # Flask backend application
├── requirements.txt                     # Python dependencies
├── crop_recommendation_model.pkl       # Your trained Random Forest model
├── label_encoder.pkl                   # Your LabelEncoder for crop names
├── frontend/
│   ├── index.html                      # Main frontend page
│   └── script.js                       # Frontend JavaScript logic
└── README.md                           # This file
```

## 🎯 Usage Example

1. **Start the backend:**
   ```bash
   python app.py
   ```

2. **Open the frontend:**
   - Open `frontend/index.html` in your browser
   - Or serve it with: `cd frontend && python -m http.server 8000`

3. **Enter soil data:**
   - Fill in the form with your soil and climate data
   - Click "Get Crop Recommendation"

4. **View results:**
   - See the recommended crop with confidence score
   - Review your input summary
   - Try different values for new predictions

## 🔮 How It Works

1. **User Input**: Farmer enters soil and climate data through the web form
2. **Data Validation**: Both frontend and backend validate the input parameters
3. **Model Prediction**: Random Forest model predicts the crop type (encoded as integer)
4. **Label Decoding**: LabelEncoder converts the integer prediction back to crop name
5. **Result Display**: Beautiful UI shows the recommended crop with confidence score

## 📞 Support

If you encounter any issues:

1. Check that all dependencies are installed correctly
2. Verify that both pickle files are present and valid
3. Ensure both backend and frontend are running
4. Check the browser console for JavaScript errors
5. Review the Flask server logs for backend errors

---

**Happy Farming! 🌾**
