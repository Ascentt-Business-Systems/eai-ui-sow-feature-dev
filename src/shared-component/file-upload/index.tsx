import React, { useState, ChangeEvent } from "react";
import AWS from "aws-sdk";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  AWS.config.update({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME! ,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        alert("File uploaded successfully!");
        console.log("File URL:", data.Location);
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
    </div>
  );
};

export default FileUpload;
