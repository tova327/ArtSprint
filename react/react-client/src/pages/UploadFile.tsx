import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase'; // Import your storage instance
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
//import { Button, Progress, Card, Text, Input } from 'shadcn/ui'; // Import components from shadcn/ui

const FileUpload: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
  
    const handleFileUpload = (file: File) => {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
        console.log(file);
        
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percent);
        },
        (error) => {
          console.error("Upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            setFileName(file.name);
          });
        }
      );
    };
  
    return (
      <Card className="p-4">
        <h1 className="text-lg font-bold mb-2">File Upload</h1>
        <h2 className="mb-4">Upload your files easily. Once uploaded, you will see the file name and a link to access it.</h2>
        <Input type="file" onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files[0]);
          }
        }} className="mb-4" />
        {progress > 0 && (
          <Progress value={progress} className="mb-4" />
        )}
        {fileName && (
          <div className="mt-4">
            <h2 className="font-semibold">Uploaded File:</h2>
            <h3>{fileName}</h3>
            <a href={downloadURL || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Download Link
            </a>
          </div>
        )}
        <Button onClick={() => setProgress(0)} className="mt-4">Reset</Button>
      </Card>
    );
  };
  
  export default FileUpload;