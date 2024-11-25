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

  const bucketName = "my-beautiful-memories"; // Định nghĩa biến bucketName ở phạm vi toàn cục trong component

  // Hàm lấy danh sách tệp từ S3
  const fetchFilesFromS3 = async () => {
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

  // Phân loại file
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

  const images = files.filter((file) =>
    imageExtensions.some((ext) => file.key.toLowerCase().endsWith(ext))
  );

  const videos = files.filter((file) =>
    videoExtensions.some((ext) => file.key.toLowerCase().endsWith(ext))
  );

  return (
    <div>
      <h1>Media Files</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && files.length === 0 && <p>No files found.</p>}

      {!loading && !error && files.length > 0 && (
        <>
          <h2>Images</h2>
          {images.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {images.map((file) => (
                <div key={file.key} style={{ textAlign: "center" }}>
                  <img
                    src={`https://${bucketName}.s3.amazonaws.com/${file.key}`}
                    alt={file.key}
                    style={{
                      width: "150px",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                  <p>{file.key}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No images found.</p>
          )}

          <h2>Videos</h2>
          {videos.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {videos.map((file) => (
                <div key={file.key} style={{ textAlign: "center" }}>
                  <video
                    controls
                    style={{
                      width: "250px",
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
                  <p>{file.key}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No videos found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FileList;
