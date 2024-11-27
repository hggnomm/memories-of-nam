import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import LoadingSpinner from "./components/LoadingSpinner"; 
import Skeleton from "react-loading-skeleton"; 
import "react-loading-skeleton/dist/skeleton.css"; 
import Mainpage from "./Mainpage"; 
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io"; 

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
  const [page, setPage] = useState(1);


  const [continuationToken, setContinuationToken] = useState(null); 
  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
  const maxItemsPerPage = 10; 

  const fetchFilesFromS3 = async () => {
    setLoading(true);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "uploads/",  // Dựng thư mục cần lấy tệp
      MaxKeys: maxItemsPerPage, // Giới hạn 10 tệp mỗi lần gọi
      ContinuationToken: continuationToken, // Token phân trang nếu có
    });

    try {
      const response = await s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        setFiles([]); // Không có tệp
        return;
      }

      // Xử lý tệp trả về
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

      // Cập nhật danh sách tệp cho trang hiện tại
      setFiles(fileList);

      // Kiểm tra xem có tiếp tục phân trang không
      if (response.IsTruncated) {
        setContinuationToken(response.NextContinuationToken);
        setSuccessMessage(`Loaded page ${page} of files.`);
      } else {
        setContinuationToken(null); // Reset token khi đã tải hết
        setSuccessMessage("All files loaded successfully!");
      }
    } catch (err) {
      setError("Failed to fetch files from S3");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesFromS3();
  }, [page]); // Mỗi khi `page` thay đổi, gọi lại hàm fetch

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
        {files.length !== 0 && <Mainpage items={items} />}
        
        {/* Phân trang */}
        <div className="fixed bottom-5 left-5 flex items-center gap-x-2 text-2xl bg-yellow-500 rounded-full px-2">
          <span
            onClick={() => page !== 1 && setPage((prevPage) => prevPage - 1)}
            className="cursor-pointer"
          >
            <IoMdArrowDropleftCircle />
          </span>
          <p className="text-xl select-none">{page}</p>
          <span
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="cursor-pointer"
          >
            <IoMdArrowDroprightCircle />
          </span>
        </div>
      </div>
    </LoadingSpinner>
  );
};

export default FileList;
