import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// S3 Client setup
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRECT_KEY,
  },
});

const FileList = () => {
  const [files, setFiles] = useState([]); // State để lưu danh sách tệp
  const [loading, setLoading] = useState(true); // State để kiểm soát loading
  const [error, setError] = useState(null); // State để lưu lỗi (nếu có)

  // Hàm lấy danh sách tệp từ S3
  const fetchFilesFromS3 = async () => {
    const bucketName = "my-beautiful-memories"; // Tên bucket
    const prefix = "uploads/"; // Cấu trúc thư mục nếu có

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
        key: file.Key, // Đường dẫn tệp
        size: file.Size, // Kích thước tệp
        lastModified: new Date(file.LastModified).toLocaleString(), // Thời gian sửa đổi (format dễ đọc)
      }));

      setFiles(fileList); // Cập nhật state files
    } catch (err) {
      setError("Failed to fetch files from S3");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchFilesFromS3 khi component mount
  useEffect(() => {
    fetchFilesFromS3();
  }, []);

  return (
    <div>
      <h1>File List</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && files.length === 0 && <p>No files found.</p>}

      {!loading && !error && files.length > 0 && (
        <ul>
          {files.map((file) => (
            <li key={file.key}>
              <p><strong>Key:</strong> {file.key}</p>
              <p><strong>Size:</strong> {file.size} bytes</p>
              <p><strong>Last Modified:</strong> {file.lastModified}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
