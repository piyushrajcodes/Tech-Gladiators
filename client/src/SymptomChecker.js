import React, { useState } from 'react';
import diarrhea from './diarrhea.png';
import fever from './fever.jpeg';
import abdominal_pain from './abdominal_pain.jpg';
import vomiting from './vomiting.jpg';
import dehydration from './dehydration.png';
import jaundice from './jaundice.jpg';
import nausea from './nausea.jpg';
import fatigue from './fatigue.jpg';
import headache from './headache.jpg';

const symptoms = [
  { name: 'diarrhea', image: diarrhea },
  { name: 'fever', image: fever },
  { name: 'abdominal pain', image: abdominal_pain },
  { name: 'vomiting', image: vomiting },
  { name: 'dehydration', image: dehydration },
  { name: 'jaundice', image: jaundice },
  { name: 'nausea', image: nausea },
  { name: 'fatigue', image: fatigue },
  { name: 'headache', image: headache }
];

const diseaseRules = {
  Cholera: ['diarrhea', 'vomiting', 'dehydration'],
  Typhoid: ['fever', 'abdominal pain', 'headache', 'fatigue'],
  HepatitisA: ['jaundice', 'fatigue', 'nausea', 'abdominal pain'],
  Diarrhea: ['diarrhea', 'abdominal pain', 'vomiting']
};

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const handleSymptomChange = (symptom) => {
    const newSelectedSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    setSelectedSymptoms(newSelectedSymptoms);
  };

  const predictDisease = () => {
    let maxMatch = 0;
    let predictedDisease = null;

    for (const disease in diseaseRules) {
      const matchingSymptoms = diseaseRules[disease].filter(symptom => selectedSymptoms.includes(symptom));
      if (matchingSymptoms.length > maxMatch) {
        maxMatch = matchingSymptoms.length;
        predictedDisease = disease;
      }
    }

    if (predictedDisease) {
      setPrediction(`Based on your symptoms, you may have a risk of **${predictedDisease}**. Please consult a doctor for a proper diagnosis.`);
    } else {
      setPrediction('No specific disease could be predicted based on the selected symptoms. Please consult a doctor if you feel unwell.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">AI Symptom-Based Disease Detection</h2>
                    <p className="text-center mb-4">Select your symptoms to get a preliminary risk prediction.</p>
                    <div className="row">
                        {symptoms.map(symptom => (
                        <div key={symptom.name} className="col-md-4">
                            <div className="text-center">
                            <img src={symptom.image} alt={symptom.name} style={{width: "50px", height: "50px"}} />
                            <div className="form-check mt-2">
                                <input
                                className="form-check-input"
                                type="checkbox"
                                value={symptom.name}
                                id={symptom.name}
                                onChange={() => handleSymptomChange(symptom.name)}
                                />
                                <label className="form-check-label" htmlFor={symptom.name}>
                                {symptom.name.charAt(0).toUpperCase() + symptom.name.slice(1)}
                                </label>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={predictDisease}>
                        Predict Disease
                        </button>
                    </div>
                    {prediction && (
                        <div className="mt-4 alert alert-info">
                        <p dangerouslySetInnerHTML={{ __html: prediction }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default SymptomChecker;
