import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const PrescriptionUpload = ({ patientId, doctorId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `prescriptions/${patientId}/${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    const db = getFirestore();
    await addDoc(collection(db, "prescriptions"), {
      patientId,
      doctorId,
      url: downloadURL,
      createdAt: new Date(),
    });

    alert("Prescription uploaded successfully!");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Prescription</button>
    </div>
  );
};

export default PrescriptionUpload;