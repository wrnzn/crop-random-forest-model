#!/usr/bin/env python3
"""
Test script for the Crop Recommendation API
Run this to verify your setup is working correctly
"""

import requests
import json

def test_api():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Crop Recommendation API...")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure Flask is running with: python app.py")
        return False
    
    # Test 2: API documentation
    print("\n2. Testing API documentation...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ API documentation accessible")
        else:
            print(f"❌ API documentation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ API documentation error: {e}")
    
    # Test 3: Prediction with sample data
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
            f"{base_url}/predict",
            json=sample_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Prediction successful!")
            print(f"   Recommended crop: {result.get('best_crop', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 'N/A')}%")
            print(f"   Message: {result.get('message', 'N/A')}")
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return False
    
    # Test 4: Invalid input handling
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
            f"{base_url}/predict",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 400:
            print("✅ Error handling working correctly")
            print(f"   Error message: {response.json().get('error', 'N/A')}")
        else:
            print(f"❌ Error handling failed: Expected 400, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API testing completed!")
    print("\nNext steps:")
    print("1. Open frontend/index.html in your browser")
    print("2. Try entering some soil data")
    print("3. Get your crop recommendation!")
    
    return True

if __name__ == "__main__":
    test_api()
