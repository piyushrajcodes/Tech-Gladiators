import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './PrescriptionRecognition.css';

const staticMedicationData = {
  "paracetamol": {
    uses: "Pain relief and fever reduction.",
    timing: "Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
    sideEffects: "Nausea, stomach pain, loss of appetite, dark urine, clay-colored stools, jaundice (yellowing of the skin or eyes)."
  },
  "amoxicillin": {
    uses: "Antibiotic used to treat bacterial infections.",
    timing: "Take one capsule every 8 hours, or as directed by your doctor. Complete the full course of medication.",
    sideEffects: "Nausea, vomiting, diarrhea, rash."
  },
  "omeprazole": {
    uses: "Reduces stomach acid. Used to treat heartburn, acid reflux, and ulcers.",
    timing: "Take one capsule once daily before a meal, or as directed by your doctor.",
    sideEffects: "Headache, nausea, diarrhea, stomach pain."
  }
};

const PrescriptionRecognition = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file)); // Create a local URL for preview
      setRecognizedText('');
      setMedicineDetails(null);
      setError(null);
    }
  };

  const handleRecognize = async () => {
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecognizedText('');
    setMedicineDetails(null);

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageUrl,
        'eng', // Language code for English
        { logger: m => console.log(m) } // Optional: log Tesseract progress
      );
      setRecognizedText(text);

      // --- Text Analysis/NLP Logic ---
      const extractedDetails = analyzePrescriptionText(text);
      setMedicineDetails(extractedDetails);

    } catch (err) {
      console.error("Error during OCR or recognition:", err);
      setError("Failed to process prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzePrescriptionText = (text) => {
    const details = {
      patientName: "Not found",
      medications: [],
      problem: "Not found",
      rawText: text,
    };

    // Simple regex for patient name (very basic, needs improvement for real-world)
    const patientNameMatch = text.match(/(Patient|Name):\s*([A-Za-z\s.]+)/i);
    if (patientNameMatch && patientNameMatch[2]) {
      details.patientName = patientNameMatch[2].trim();
    }

    // Simple keyword spotting for common problems (very basic)
    const problemKeywords = ["fever", "headache", "infection", "pain", "cough", "cold", "flu"];
    for (const keyword of problemKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        details.problem = keyword;
        break;
      }
    }

    // Medication extraction and analysis
    for (const medName in staticMedicationData) {
      const regex = new RegExp(`\b${medName}\b`, 'i');
      if (regex.test(text)) {
        const medicationInfo = staticMedicationData[medName];
        // Attempt to extract dosage and timing from the text near the medication name
        // This is highly simplistic and would need advanced NLP for accuracy
        // eslint-disable-next-line no-useless-escape
        const dosageMatch = text.match(new RegExp(`${medName}\s+([0-9.]+m?g?)\s*(.*?)(daily|twice|thrice|morning|evening|night|after meal|before meal)`, 'i'));
        let dosage = "Not specified";
        let timing = medicationInfo.timing; // Default from static data

        if (dosageMatch) {
          dosage = dosageMatch[1].trim();
          if (dosageMatch[3]) {
            timing = `Take ${dosageMatch[3].trim()} - ${medicationInfo.timing}`;
          }
        }

        details.medications.push({
          name: medName,
          dosage: dosage,
          uses: medicationInfo.uses,
          timing: timing,
          sideEffects: medicationInfo.sideEffects,
        });
      }
    }

    return details;
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
      <div className="prescription-recognition-container">
        <h1>Prescription Image Recognition</h1>

        <div className="upload-section">
          <div className="file-input-wrapper">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <span>{image ? image.name : "Choose Image"}</span>
          </div>
          <button
            className="upload-button"
            onClick={handleRecognize}
            disabled={!image || loading}
          >
            {loading ? "Processing..." : "Recognize Prescription"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>

        {imageUrl && (
          <div className="image-preview-card">
            <h2>Uploaded Image:</h2>
            <img src={imageUrl} alt="Prescription" />
          </div>
        )}

        {recognizedText && (
          <div className="recognized-text-card">
            <h2>Recognized Text:</h2>
            <p>{recognizedText}</p>
          </div>
        )}

        {medicineDetails && (
          <div className="medicine-details-card">
            <h2>Analyzed Prescription:</h2>
            <p><strong>Patient Name:</strong> {medicineDetails.patientName}</p>
            <p><strong>Problem:</strong> {medicineDetails.problem}</p>
            <h3>Medications:</h3>
            {medicineDetails.medications.length > 0 ? (
              medicineDetails.medications.map((med, index) => (
                <div key={index} className="medication-item">
                  <p><strong>Medicine Name:</strong> {med.name}</p>
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Uses:</strong> {med.uses}</p>
                  <p><strong>When to take:</strong> {med.timing}</p>
                  <p><strong>Side Effects:</strong> {med.sideEffects}</p>
                </div>
              ))
            ) : (
              <p>No known medications found in the static database.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionRecognition;
