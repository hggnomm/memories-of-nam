import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import "react-loading-skeleton/dist/skeleton.css";
import Mainpage from "./Mainpage";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";

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
  const [hasMore, setHasMore] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
  const maxItemsPerPage = 10;

  const fetchFilesFromS3 = async () => {
    setLoading(true);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "uploads/",
      MaxKeys: 1000, // Fetch more items to sort later
      ContinuationToken: continuationToken,
    });

    try {
      const response = await s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        setFiles([]);
        return;
      }

      // Process and sort files
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
      }))
        // Filter by selected year
        .filter((file) => file.lastModified.getFullYear() === selectedYear)
        // Sort from newest to oldest
        .sort((a, b) => b.lastModified - a.lastModified);

      // Paginate the sorted files
      const startIndex = (page - 1) * maxItemsPerPage;
      const paginatedFiles = fileList.slice(
        startIndex,
        startIndex + maxItemsPerPage
      );

      setFiles(paginatedFiles);
      setHasMore(fileList.length > startIndex + maxItemsPerPage);

      // Update success message
      setSuccessMessage(
        `Loaded ${paginatedFiles.length} files for ${selectedYear}`
      );
    } catch (err) {
      setError("Failed to fetch files from S3");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiles([]);
    setContinuationToken(null);
    fetchFilesFromS3();
  }, [page, selectedYear]);

  const items = files.map((file, index) => ({
    id: index + 1,
    img: `https://${bucketName}.s3.amazonaws.com/${file.key}`,
    isVideo: file.isVideo,
  }));

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page
  };

  return (
    <>
      <Loading
        isLoading={loading}
        error={error}
        successMessage={successMessage}
      >
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-950">
          {files.length === 0 && !loading && (
            <div className="h-screen w-screen flex justify-center items-center">
              <p className="text-white font-medium text-xl">
                No memories found.
              </p>
            </div>
          )}
          <div className="relative h-screen w-full">
            {files.length !== 0 && <Mainpage items={items} />}
            <div className="absolute w-auto left-1/2 xl:bottom-[7.7rem] bottom-52 transform -translate-x-1/2 flex flex-col items-center gap-2">
              {/* Year Select */}
              <div className="flex items-center">
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="rounded xl:px-2 xl:py-1 cursor-pointer bg-yellow-200 outline-none"
                >
                  {Array.from({ length: 3 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option
                        key={year}
                        value={year}
                        className="cursor-pointer outline-none border-none xl:text-base text-xs p-0"
                      >
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-x-2 text-2xl bg-yellow-200 rounded-full xl:px-2 xl:py-1">
                <span
                  onClick={() =>
                    page > 1 && setPage((prevPage) => prevPage - 1)
                  }
                  className="cursor-pointer"
                  disabled={page === 1}
                >
                  <IoMdArrowDropleftCircle />
                </span>
                <p className="xl:text-xl text-base select-none">{page}</p>
                <span
                  onClick={() => {
                    if (hasMore) {
                      setPage((prevPage) => prevPage + 1);
                    } else {
                      toast.info("You have reached the last page.");
                    }
                  }}
                  className="cursor-pointer"
                  disabled={!hasMore}
                >
                  <IoMdArrowDroprightCircle />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Loading>
    </>
  );
};

export default FileList;
