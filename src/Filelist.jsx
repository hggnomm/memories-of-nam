import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import LoadingSpinner from "./components/LoadingSpinner"; // Import component LoadingSpinner

// S3 Client setup
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  },
});

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;

  const fetchFilesFromS3 = async () => {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "uploads/",
    });

    try {
      const response = await s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        setFiles([]);
        return;
      }

      const fileList = response.Contents.map((file) => ({
        key: file.Key,
        size: (file.Size / 1024).toFixed(2) + " KB",
        lastModified: new Date(file.LastModified),
      }));

      fileList.sort((a, b) => b.lastModified - a.lastModified);
      setFiles(fileList);
      setSuccessMessage("Files fetched successfully!");
    } catch (err) {
      setError("Failed to fetch files from S3");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesFromS3();
  }, []);

  return (
    <LoadingSpinner
      isLoading={loading}
      error={error}
      successMessage={successMessage}
    >
      <div>
        {files.length === 0 && !loading && <p>No files found.</p>}
        <div>
          {files.map((file) => (
            <div key={file.key} style={{ width: "250px", textAlign: "center" }}>
              {file.key.toLowerCase().endsWith(".mp4") ||
              file.key.toLowerCase().endsWith(".mov") ||
              file.key.toLowerCase().endsWith(".avi") ||
              file.key.toLowerCase().endsWith(".mkv") ||
              file.key.toLowerCase().endsWith(".webm") ? (
                <video
                  controls
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                >
                  <source
                    src={`https://${bucketName}.s3.amazonaws.com/${file.key}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`https://${bucketName}.s3.amazonaws.com/${file.key}`}
                  alt={file.key}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </LoadingSpinner>
  );
};

export default FileList;
