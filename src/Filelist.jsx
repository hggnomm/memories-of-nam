import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// S3 Client setup
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY, // Sửa lỗi chính tả
  },
});

const FileList = () => {
  const [files, setFiles] = useState([]); // State để lưu danh sách tệp
  const [loading, setLoading] = useState(true); // State để kiểm soát loading
  const [error, setError] = useState(null); // State để lưu lỗi (nếu có)

  const bucketName = "my-beautiful-memories"; // Định nghĩa biến bucketName
  const prefix = "uploads/"; // Cấu trúc thư mục trong S3

  // Hàm lấy danh sách tệp từ S3
  const fetchFilesFromS3 = async () => {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    try {
      const response = await s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        setFiles([]);
        return;
      }

      const fileList = response.Contents.map((file) => ({
        key: file.Key,
        size: (file.Size / 1024).toFixed(2) + " KB", // Hiển thị kích thước tệp
        lastModified: new Date(file.LastModified).toLocaleString(), // Format thời gian
      }));

      setFiles(fileList);
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
    <div style={{ padding: "20px" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && files.length === 0 && <p>No files found.</p>}

      {!loading && !error && files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
              {/* <p>
                <strong>File:</strong> {file.key.split("/").pop()}
              </p>
              <p>
                <strong>Size:</strong> {file.size}
              </p>
              <p>
                <strong>Last Modified:</strong> {file.lastModified}
              </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
