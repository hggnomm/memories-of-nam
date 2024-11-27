import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import LoadingSpinner from "./components/LoadingSpinner"; // Import component LoadingSpinner
import Skeleton from "react-loading-skeleton"; // Import Skeleton library
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS for Skeleton
import Mainpage from "./Mainpage"; // Import Mainpage component

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
        isVideo:
          file.Key.toLowerCase().endsWith(".mp4") ||
          file.Key.toLowerCase().endsWith(".mov") ||
          file.Key.toLowerCase().endsWith(".avi") ||
          file.Key.toLowerCase().endsWith(".mkv") ||
          file.Key.toLowerCase().endsWith(".webm"),
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

  // Biến files thành mảng các đối tượng {id, img, isVideo}
  const items = files.map((file, index) => ({
    id: index + 1,
    img: `https://${bucketName}.s3.amazonaws.com/${file.key}`, // Địa chỉ hình ảnh hoặc video
    isVideo: file.isVideo,
  }));

  return (
    <LoadingSpinner
      isLoading={loading}
      error={error}
      successMessage={successMessage}
    >
      <div>
        {files.length === 0 && !loading && <p>No files found.</p>}
        {/* Chuyển props 'items' vào Mainpage */}
        {files.length !== 0  && <Mainpage items={items} />}
      </div>
    </LoadingSpinner>
  );
};

export default FileList;
