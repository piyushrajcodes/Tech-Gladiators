import React, { useState } from 'react';

function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  const calculateBmi = () => {
    if (age && height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);

      if (age < 18) {
        if (bmiValue < 18.5) {
          setMessage('Underweight (Consult a doctor for child nutrition)');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
          setMessage('Normal weight (Maintain a healthy lifestyle)');
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
          setMessage('Overweight (Monitor diet and exercise)');
        } else {
          setMessage('Obese (High risk - Seek medical advice)');
        }
      } 
      else if (age >= 18 && age < 65) {
        if (bmiValue < 18.5) { 
          setMessage('Underweight (Increase nutrition intake)');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
          setMessage('Normal weight (Maintain a balanced diet)');
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
          setMessage('Overweight (Consider lifestyle changes)');
        } else {
          setMessage('Obese (Consult a healthcare professional)');
        }
      } 
      else {
        if (bmiValue < 18.5) {
          setMessage('Underweight (Monitor health and nutrition)');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
          setMessage('Normal weight (Good! Maintain your lifestyle)');
        } else if (bmiValue >= 24.9 && bmiValue < 29.9) {
          setMessage('Overweight (Stay active and maintain diet)');
        } else {
          setMessage('Obese (High risk - Seek medical advice)');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Real-Time Health Tracking</h2>
                    <div className="mb-3">
                        <label htmlFor="height" className="form-label">Height (cm)</label>
                        <input
                        type="number"
                        className="form-control"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="weight" className="form-label">Weight (kg)</label>
                        <input
                        type="number"
                        className="form-control"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="age" className="form-label">Age</label>
                        <input
                        type="number"
                        className="form-control"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={calculateBmi}>
                        Calculate BMI
                        </button>
                    </div>
                    {bmi && (
                        <div className="mt-4 text-center">
                        <h3>Your BMI: {bmi}</h3>
                        <p>This is considered: <strong>{message}</strong></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default BMICalculator;
