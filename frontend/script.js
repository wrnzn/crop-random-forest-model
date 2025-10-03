// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const form = document.getElementById('cropForm');
const submitBtn = document.getElementById('submitBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const resultContent = document.getElementById('resultContent');
const secondaryContent = document.getElementById('secondaryContent');
let probChartInstance = null;

// Form submission handler
// Prevent native browser validation/navigation
form.setAttribute('novalidate', 'novalidate');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    showLoading();
    hideResults();
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = {
            N: parseFloat(formData.get('N')),
            P: parseFloat(formData.get('P')),
            K: parseFloat(formData.get('K')),
            temperature: parseFloat(formData.get('temperature')),
            humidity: parseFloat(formData.get('humidity')),
            ph: parseFloat(formData.get('ph')),
            rainfall: parseFloat(formData.get('rainfall'))
        };
        
        // Validate inputs
        if (!validateInputs(data)) {
            hideLoading();
            return;
        }
        
        // Make API request
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        // Hide loading and show results
        hideLoading();
        
        if (response.ok) {
            displaySuccessResult(result);
            displaySecondarySuggestions(result);
            renderProbabilityChart(result);
        } else {
            displayErrorResult(result.error || 'An error occurred');
        }
        
    } catch (error) {
        hideLoading();
        displayErrorResult(`Network error: ${error.message}. Please ensure the backend server is running.`);
    }
    return false; // extra guard to prevent any default navigation
});

// Surface unexpected JS errors to the UI instead of silently reloading
window.addEventListener('error', (event) => {
    try {
        hideLoading();
    } catch (_) {}
    const message = event?.error?.message || event?.message || 'Unexpected error';
    displayErrorResult(`Unexpected error: ${message}`);
});

// Input validation
function validateInputs(data) {
    const errors = [];
    
    // Check for required fields
    const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    for (const field of requiredFields) {
        if (isNaN(data[field]) || data[field] === '') {
            errors.push(`${field} is required and must be a number`);
        }
    }
    
    // Check ranges
    if (data.N < 0 || data.N > 200) errors.push('N must be between 0 and 200');
    if (data.P < 0 || data.P > 200) errors.push('P must be between 0 and 200');
    if (data.K < 0 || data.K > 200) errors.push('K must be between 0 and 200');
    if (data.temperature < -50 || data.temperature > 60) errors.push('Temperature must be between -50 and 60°C');
    if (data.humidity < 0 || data.humidity > 100) errors.push('Humidity must be between 0 and 100%');
    if (data.ph < 0 || data.ph > 14) errors.push('pH must be between 0 and 14');
    if (data.rainfall < 0 || data.rainfall > 1000) errors.push('Rainfall must be between 0 and 1000mm');
    
    if (errors.length > 0) {
        displayErrorResult(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Display successful prediction result
function displaySuccessResult(result) {
    const cropName = result.best_crop;
    const confidence = result.confidence;
    
    resultContent.innerHTML = `
        <div class="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-8 border-2 border-green-200">
            <div class="text-center">
                <div class="mb-4">
                    <i class="fas fa-seedling text-6xl text-green-600 mb-4"></i>
                </div>
                <h4 class="text-3xl font-bold text-gray-800 mb-2">${cropName}</h4>
                <p class="text-lg text-gray-600 mb-4">is the recommended crop for your conditions</p>
                ${confidence ? `
                    <div class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                        <i class="fas fa-chart-line mr-2"></i>
                        ${confidence}% Confidence
                    </div>
                ` : ''}
            </div>
            
            <div class="mt-6 pt-6 border-t border-green-200">
                <h5 class="text-lg font-semibold text-gray-700 mb-3">Your Input Summary:</h5>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div class="bg-white rounded-lg p-3 text-center">
                        <div class="font-semibold text-gray-600">N</div>
                        <div class="text-lg font-bold text-red-600">${document.getElementById('N').value}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <div class="font-semibold text-gray-600">P</div>
                        <div class="text-lg font-bold text-orange-600">${document.getElementById('P').value}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <div class="font-semibold text-gray-600">K</div>
                        <div class="text-lg font-bold text-purple-600">${document.getElementById('K').value}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <div class="font-semibold text-gray-600">pH</div>
                        <div class="text-lg font-bold text-indigo-600">${document.getElementById('ph').value}</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 text-center">
                <button onclick="resetForm()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    <i class="fas fa-redo mr-2"></i>
                    Try Another Prediction
                </button>
            </div>
        </div>
    `;
    
    showResults();
}

// Display error result
function displayErrorResult(error) {
    resultContent.innerHTML = `
        <div class="bg-red-100 border-2 border-red-200 rounded-xl p-8">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h4 class="text-xl font-bold text-red-800 mb-2">Error</h4>
                <p class="text-red-600">${error}</p>
                <button onclick="resetForm()" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    <i class="fas fa-redo mr-2"></i>
                    Try Again
                </button>
            </div>
        </div>
    `;
    
    showResults();
}

// Show/hide functions
function showLoading() {
    loadingDiv.classList.remove('hidden');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-magic mr-2"></i>Get Crop Recommendation';
}

function showResults() {
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function hideResults() {
    resultsDiv.classList.add('hidden');
}

// Reset form function
function resetForm() {
    form.reset();
    hideResults();
    form.scrollIntoView({ behavior: 'smooth' });
}

// Render secondary suggestions (top-2 after primary)
function displaySecondarySuggestions(result) {
    const top = Array.isArray(result.top_predictions) ? result.top_predictions : [];
    // Filter out the primary crop and take next two
    const secondary = top.filter(item => item.crop !== result.best_crop).slice(0, 2);
    if (secondary.length === 0) {
        secondaryContent.innerHTML = '';
        return;
    }
    const cards = secondary.map((s, i) => `
        <div class="bg-white border rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-${i === 0 ? '200' : '100'} flex items-center justify-center">
                        <i class="fas fa-leaf text-green-700"></i>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">Alternative ${i + 1}</div>
                        <div class="text-lg font-semibold text-gray-800">${s.crop}</div>
                    </div>
                </div>
                <div class="text-sm font-semibold text-green-700">${s.probability}%</div>
            </div>
        </div>
    `).join('');
    secondaryContent.innerHTML = `
        <h4 class="text-lg font-semibold text-gray-700 mb-3"><i class="fas fa-list text-green-600 mr-2"></i>Other likely crops</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
    `;
}

// Render adaptive probability chart
function renderProbabilityChart(result) {
    const ctx = document.getElementById('probChart');
    if (!ctx) return;
    const top = Array.isArray(result.top_predictions) ? result.top_predictions : [];
    if (top.length === 0) {
        if (probChartInstance) {
            probChartInstance.destroy();
            probChartInstance = null;
        }
        return;
    }
    const labels = top.map(t => t.crop);
    const data = top.map(t => t.probability);
    if (probChartInstance) {
        probChartInstance.destroy();
    }
    probChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Confidence (%)',
                data,
                backgroundColor: ['#86efac', '#a7f3d0', '#93c5fd'],
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } }
            }
        }
    });
}

// Check backend connection on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            const health = await response.json();
            console.log('Backend connection successful:', health);
        } else {
            console.warn('Backend health check failed');
        }
    } catch (error) {
        console.warn('Cannot connect to backend:', error.message);
        // Show a subtle notification that backend might not be running
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>Backend server not detected. Please ensure the Flask server is running.</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
});
