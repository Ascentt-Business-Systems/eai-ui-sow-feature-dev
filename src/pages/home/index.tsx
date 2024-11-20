import React, { useState, ChangeEvent, DragEvent } from "react";
import AWS from "aws-sdk";
import { Box, Button, Typography, styled, useTheme } from "@mui/material";
import { toast } from "react-toastify";
import { MAXFILESIZE } from "utility/constants";


interface UploadedFile {
  name: string;
  size: number;
  url: string;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  region: process.env.REACT_APP_AWS_REGION!,
});

const s3 = new AWS.S3();
const Home: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [totalFileSize, setTotalFileSize] = useState<number>(0);
  const theme = useTheme();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    addFiles(selectedFiles);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, totalFileSize);
    if (totalSize > MAXFILESIZE * 1024 * 1024) {
      toast.error(`Total file size exceeded! (${(totalSize / 1048576).toFixed(2)} MB/${MAXFILESIZE} MB)`);
      return;
    }

    const filteredFiles = newFiles.filter(
      (file) =>
        file.type === "application/pdf" &&
        !files.some((f) => f.name === file.name)
    );

    if (filteredFiles.length < newFiles.length) {
      toast.warning("Duplicate or non-PDF files were excluded!");
    }

    setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
    setTotalFileSize((prevSize) => prevSize + filteredFiles.reduce((acc, file) => acc + file.size, 0));
  };

  const handleUpload = async () => {
    const newUploadedFiles: UploadedFile[] = [];
    for (const file of files) {
      try {
        const params: AWS.S3.PutObjectRequest = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME!,
          Key: file.name,
          Body: file,
          ContentType: file.type,
        };

        const uploadResult = await s3.upload(params).promise();
        newUploadedFiles.push({
          name: file.name,
          size: file.size,
          url: uploadResult.Location,
        });
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
        toast.error(`Error uploading file: ${file.name}`);
      }
    }
      // After all files are uploaded, send the URLs to the backend
    if (newUploadedFiles.length > 0) {
      try {
        // Assuming your backend API is at '/upload-files'
        const response = await fetch("http://127.0.0.1:8000/extractinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files: newUploadedFiles.map((file) => file.url),
          }),
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
          toast.success("Files uploaded and URLs saved successfully!");
        } else {
          toast.error("Error saving URLs to backend!");
        }
      } catch (error) {
        console.error("Error calling the API:", error);
        toast.error("Error calling the backend API.");
      }
    }

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
    setFiles([]);
    setTotalFileSize(0);
    toast.success("Files uploaded successfully!");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Box display={"flex"} gap={1.5} p={1}>
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Button variant="contained" component="label">
            Select Files
            <VisuallyHiddenInput
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Typography variant="caption">
            Total Size: {(totalFileSize / 1048576).toFixed(2)} MB / Max Size:{" "}
            {MAXFILESIZE} MB
          </Typography>
        </Box>
      </Box>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={files.length === 0}
        >
          Upload to S3
        </Button>
      </Box>

      <Box mt={2}>
        <Typography variant="h6">Selected Files</Typography>
        {files.map((file, index) => (
          <Typography key={index}>
            {file.name} - {(file.size / 1048576).toFixed(2)} MB
          </Typography>
        ))}
      </Box>

      <Box mt={2}>
        <Typography variant="h6">Uploaded Files</Typography>
        {uploadedFiles.map((file, index) => (
          <Typography key={index}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>{" "}
            - {(file.size / 1048576).toFixed(2)} MB
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
