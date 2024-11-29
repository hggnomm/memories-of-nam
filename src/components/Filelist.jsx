import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import "react-loading-skeleton/dist/skeleton.css";
import Mainpage from "./Mainpage";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import Loading from "./Loading";

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
  const [continuationToken, setContinuationToken] = useState(null); // Lưu token phân trang
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem có thêm tệp hay không

  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
  const maxItemsPerPage = 10;

  const fetchFilesFromS3 = async () => {
    setLoading(true);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "uploads/", // Dựng thư mục cần lấy tệp
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
        setHasMore(true); // Có thêm tệp cho các trang sau
        setSuccessMessage(`Loaded page ${page} of files.`);
      } else {
        setContinuationToken(null); // Reset token khi đã tải hết
        setHasMore(false); // Không còn tệp để tải thêm
        setSuccessMessage("All files loaded successfully!");
        toast.info("You have reached the last page."); // Hiển thị toast khi tới trang cuối cùng
      }
    } catch (err) {
      setError("Failed to fetch files from S3");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiles([]); // Reset lại danh sách tệp mỗi khi trang thay đổi
    setContinuationToken(null); // Reset lại token phân trang
    fetchFilesFromS3(); // Gọi hàm tải dữ liệu cho trang mới
  }, [page]); // Mỗi khi `page` thay đổi, gọi lại hàm fetch

  // Biến files thành mảng các đối tượng {id, img, isVideo}
  const items = files.map((file, index) => ({
    id: index + 1,
    img: `https://${bucketName}.s3.amazonaws.com/${file.key}`, // Địa chỉ hình ảnh hoặc video
    isVideo: file.isVideo,
  }));

  return (
    <>
      <Loading
        isLoading={loading}
        error={error}
        successMessage={successMessage}
      >
        <div className="h-screen w-100%">
          {files.length === 0 && !loading && <p>No files found.</p>}
          {/* Chuyển props 'items' vào Mainpage */}
          {files.length !== 0 && <Mainpage items={items} />}
        </div>
      </Loading>
      {/* Phân trang */}
      <div className="fixed xl:bottom-10 xl:left-[5.8rem] bottom-[23%] left-1/2 transform -translate-x-1/2 flex items-center gap-x-2 text-2xl bg-yellow-500 rounded-full px-2 py-1">
        <span
          onClick={() => page > 1 && setPage((prevPage) => prevPage - 1)}
          className="cursor-pointer"
          disabled={page === 1}
        >
          <IoMdArrowDropleftCircle />
        </span>
        <p className="text-xl select-none">{page}</p>
        <span
          onClick={() => {
            if (hasMore) {
              setPage((prevPage) => prevPage + 1);
            } else {
              toast.info("You have reached the last page."); // Hiển thị toast khi không còn trang tiếp theo
            }
          }}
          className="cursor-pointer"
          disabled={!hasMore}
        >
          <IoMdArrowDroprightCircle />
        </span>
      </div>
    </>
  );
};

export default FileList;
