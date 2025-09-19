from flask import Flask, jsonify
from flask_cors import CORS
from predictions import get_predictions

# Create a Flask application instance
app = Flask(__name__)
# Enable CORS to allow requests from your frontend
CORS(app)

@app.route("/")
def home():
    """A simple route to check if the backend is running."""
    return "Quantum ML Backend is running!"

@app.route("/api/predictions")
def api_predictions():
    """
    The main API endpoint that the frontend will call.
    It fetches the prediction data and returns it as JSON.
    """
    # Call the function that runs the models on historical data
    prediction_data = get_predictions()
    
    # Return the data in a JSON format
    # The frontend expects a plain array, so we return that directly.
    return jsonify(prediction_data)

# This block ensures the server runs only when the script is executed directly
if __name__ == "__main__":
    # app.run() starts the development server
    # debug=True enables auto-reloading
    # host='0.0.0.0' makes it accessible from your local network
    app.run(host='0.0.0.0', port=5000, debug=True)