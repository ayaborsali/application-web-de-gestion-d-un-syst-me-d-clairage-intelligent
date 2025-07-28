import React, { useState, useEffect } from 'react';
import { storage, db } from '../../firebase'; // ta config firebase
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const DataReport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  // Sélection du fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  // Upload + enregistrement Firestore
  const handleUpload = () => {
    if (!file) return;

    const storageRef = ref(storage, `reports/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setError(null);

    uploadTask.on(
      'state_changed',
      null,
      (err) => {
        setError('Erreur upload: ' + err.message);
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Enregistre les métadonnées dans Firestore
          await addDoc(collection(db, 'uploadedReports'), {
            name: file.name,
            url: downloadURL,
            createdAt: new Date()
          });

          setFile(null);
          fetchFiles();
        } catch (e) {
          setError('Erreur Firestore: ' + e.message);
        }
        setUploading(false);
      }
    );
  };

  // Récupère la liste des fichiers depuis Firestore
  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'uploadedReports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploadedFiles(files);
    } catch (e) {
      setError('Erreur récupération fichiers: ' + e.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => window.history.back()}>← Retour</button>
      <h2>📤 Upload fichier + sauvegarde dans Firestore</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Uploader'}
      </button>
      {file && <span style={{ marginLeft: '10px' }}>{file.name}</span>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Fichiers uploadés :</h3>
      {uploadedFiles.length === 0 ? (
        <p>Aucun fichier.</p>
      ) : (
        <ul>
          {uploadedFiles.map((f) => (
            <li key={f.id}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
              {' '}({new Date(f.createdAt.seconds * 1000).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataReport;
