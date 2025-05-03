"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Folder, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoutButton from "@/components/logoutButton";
import { createFolder, getDriveData, uploadFile } from "@/lib/drive";
import FileThumbnail from "@/components/fileThumbnail";

export default function DriveView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFolderId = searchParams.get("folderId") || null;

  const [isLoading, setIsLoading] = useState(true);
  const [driveItems, setDriveItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    setIsLoading(true);
    try {
      await createFolder(folderName, currentFolderId);
      setFolderName("");
      handleGetDriveData();
      toast.success("Folder created!");
    } catch (err) {
      toast.error(err?.message || "Error creating folder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("parentId", currentFolderId || "");

    setIsLoading(true);
    try {
      await uploadFile(formData);
      handleGetDriveData();
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setIsLoading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleGetDriveData = async () => {
    try {
      const driveResponse = await getDriveData(currentFolderId);
      setDriveItems(driveResponse?.data?.items || []);
      setCurrentFolder(driveResponse?.data?.currentFolder);
    } catch (error) {
      toast.error(error?.message || "Failed to load drive data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const parentId = currentFolder?.parentId;

    const url = new URL(window.location.href);
    url.searchParams.delete("folderId");

    if (parentId) {
      url.searchParams.set("folderId", parentId);
    }

    router.push(url.pathname + url.search);
  };

  useEffect(() => {
    handleGetDriveData();
  }, [currentFolderId]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Google Drive Clone</h1>
        <LogoutButton />
      </div>

      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Drive</h2>
          {currentFolderId && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row mb-10">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <div className="flex items-center gap-2">
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreateFolder}
                disabled={isLoading || !folderName.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="fileUpload">Upload File</Label>
            <Input id="fileUpload" type="file" onChange={handleUploadFile} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : driveItems.length === 0 ? (
          <p className="text-gray-500 text-center">This folder is empty</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
            {driveItems.map((item) => (
              <div
                key={item._id}
                className="border p-4 rounded-lg bg-muted hover:bg-background transition text-center cursor-pointer"
                onDoubleClick={() => {
                  if (item.type === "folder") {
                    router.push(`/dashboard?folderId=${item._id}`);
                  }
                }}
              >
                {item.type === "folder" ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Folder className="w-12 h-12 text-yellow-500" />
                    <span className="font-medium break-words">{item.name}</span>
                  </div>
                ) : (
                  <FileThumbnail file={item} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
