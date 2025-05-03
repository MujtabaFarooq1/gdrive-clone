import React from "react";
import {
  File,
  FileText,
  FileAudio,
  FileVideo,
  BookMinus,
  FileCode,
} from "lucide-react";
import Link from "next/link";

const getIconForFile = (mimeType, extension) => {
  if (mimeType === "image") return null; // image files will show as a preview
  if (extension === "pdf")
    return <BookMinus className="w-16 h-16 text-gray-500" />;
  if (["doc", "docx"].includes(extension))
    return <FileText className="w-16 h-16 text-gray-500" />;
  if (["xls", "xlsx"].includes(extension))
    return <FileCode className="w-16 h-16 text-gray-500" />;
  if (mimeType === "video")
    return <FileVideo className="w-16 h-16 text-gray-500" />;
  if (mimeType === "audio")
    return <FileAudio className="w-16 h-16 text-gray-500" />;
  return <File className="w-16 h-16 text-gray-500" />; // default file icon
};

const FileThumbnail = ({ file }) => {
  const { name, url, mimeType, extension } = file;

  const isImage = mimeType === "image";

  return (
    <Link
      href={url}
      target="_blank"
      className="flex flex-col text-center justify-center items-center w-full"
    >
      {isImage ? (
        <img
          src={url}
          alt={name}
          className="w-32 h-32 object-cover rounded-md"
        />
      ) : (
        getIconForFile(mimeType, extension)
      )}
      <p className="text-sm mt-2 text-center truncate w-32">{name}</p>
    </Link>
  );
};

export default FileThumbnail;
