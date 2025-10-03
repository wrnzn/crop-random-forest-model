#!/usr/bin/env python3
"""
Test script to verify your crop recommendation setup
Run this to check if everything is working correctly
"""

import requests
import json
import os

def test_setup():
    print("🧪 Testing Crop Recommendation System Setup...")
    print("=" * 60)
    
    # Check if model files exist
    print("\n1. Checking model files...")
    model_file = "crop_recommendation_model.pkl"
    encoder_file = "label_encoder.pkl"
    
    if os.path.exists(model_file):
        print(f"✅ {model_file} found")
    else:
        print(f"❌ {model_file} not found!")
        print("Please place your trained Random Forest model file here.")
        return False
    
    if os.path.exists(encoder_file):
        print(f"✅ {encoder_file} found")
    else:
        print(f"❌ {encoder_file} not found!")
        print("Please place your LabelEncoder file here.")
        return False
    
    # Test Flask server connection
    print("\n2. Testing Flask server connection...")
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Flask server is running")
            print(f"   Model loaded: {health_data.get('model_loaded', False)}")
            print(f"   Label encoder loaded: {health_data.get('label_encoder_loaded', False)}")
        else:
            print(f"❌ Flask server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server")
        print("Please start the server with: python app.py")
        return False
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        return False
    
    # Test prediction endpoint
    print("\n3. Testing prediction endpoint...")
    sample_data = {
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 20.87,
        "humidity": 82.0,
        "ph": 6.5,
        "rainfall": 202.9
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/predict",
            json=sample_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prediction successful!")
            print(f"   Recommended crop: {result.get('best_crop', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 'N/A')}%")
            print(f"   Message: {result.get('message', 'N/A')}")
        else:
            print(f"❌ Prediction failed with status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
        return False
    
    # Test error handling
    print("\n4. Testing error handling...")
    invalid_data = {
        "N": -10,  # Invalid: negative value
        "P": 42,
        "K": 43,
        "temperature": 20.87,
        "humidity": 82.0,
        "ph": 6.5,
        "rainfall": 202.9
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/predict",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 400:
            print("✅ Error handling working correctly")
            error_data = response.json()
            print(f"   Error message: {error_data.get('error', 'N/A')}")
        else:
            print(f"❌ Error handling failed: Expected 400, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Setup test completed successfully!")
    print("\nNext steps:")
    print("1. Open frontend/index.html in your browser")
    print("2. Try entering some soil data")
    print("3. Get your crop recommendation!")
    print("\nYour system is ready to use! 🌱")
    
    return True

if __name__ == "__main__":
    test_setup()
