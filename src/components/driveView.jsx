"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Folder, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoutButton from "@/components/logoutButton";
import {
  createFolder,
  deleteDriveItemAndItsChildren,
  getDriveData,
  renameDriveItem,
  uploadFile,
} from "@/lib/drive";
import FileThumbnail from "@/components/fileThumbnail";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import DriveItemDialog from "./drive-dialogItem";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DriveView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const currentFolderId = searchParams.get("folderId") || null;

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [driveItems, setDriveItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [folderName, setFolderName] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogAction, setDialogAction] = useState("");

  const MAX_FILE_SIZE = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleDialogOpen = (item, action) => {
    setSelectedItem(item);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCreateFolder = async () => {
    setIsCreatingFolder(true);
    try {
      await createFolder(folderName, currentFolderId);
      setFolderName("");
      await handleGetDriveData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Max size is 5MB.");
      return (e.target.value = "");
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("parentId", currentFolderId || "");

    setIsLoading(true);
    try {
      await uploadFile(formData);
      handleGetDriveData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const handleGetDriveData = async () => {
    try {
      const driveResponse = await getDriveData(currentFolderId);
      setDriveItems(driveResponse?.data?.items || []);
      setCurrentFolder(driveResponse?.data?.currentFolder);
    } catch (err) {
      console.log(err);
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

    setIsLoading(true);
    router.push(url.pathname + url.search, { scroll: false });
  };

  const handleRenameDriveItem = async (id, name) => {
    try {
      setIsLoading(true);
      await renameDriveItem(id, name);
      await handleGetDriveData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItemAndChildren = async (id) => {
    try {
      setIsLoading(true);
      await deleteDriveItemAndItsChildren(id);
      await handleGetDriveData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetDriveData();
  }, [currentFolderId]);

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-semibold">
          Google Drive Clone
        </h1>
        <LogoutButton />
      </div>

      <div className="p-4 sm:p-6 border rounded-lg shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Welcome to Drive
          </h2>
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreateFolder}
                disabled={isCreatingFolder || !folderName.trim()}
              >
                {isCreatingFolder ? (
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

        <DriveItemDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          title={
            dialogAction === "delete"
              ? "Delete this item?"
              : "Rename this item?"
          }
          description={
            dialogAction === "delete"
              ? `Are you sure you want to delete "${selectedItem?.name}" ${
                  selectedItem?.type === "folder" ? "and its children" : ""
                }? This cannot be undone.`
              : `Enter a new name for "${selectedItem?.name}".`
          }
          confirmText={dialogAction === "delete" ? "Delete" : "Rename"}
          action={dialogAction}
          item={selectedItem}
          onConfirm={async (newName) => {
            if (!selectedItem) return;

            if (dialogAction === "delete") {
              await handleDeleteItemAndChildren(selectedItem._id);
            } else {
              await handleRenameDriveItem(selectedItem._id, newName);
            }
            handleGetDriveData();
          }}
          onCancel={() => setSelectedItem(null)}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : driveItems.length === 0 ? (
          <p className="text-gray-500 text-center">This folder is empty</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 select-none">
            {driveItems.map((item) => (
              <div
                key={item._id}
                className="relative border p-3 sm:p-4 rounded-lg bg-muted hover:bg-background transition text-center cursor-pointer flex flex-col items-center justify-center"
                onClick={() => {
                  if (isMobile && item.type === "folder") {
                    setIsLoading(true);
                    router.push(`/dashboard?folderId=${item._id}`, {
                      scroll: false,
                    });
                  }
                }}
                onDoubleClick={() => {
                  if (!isMobile && item.type === "folder") {
                    setIsLoading(true);
                    router.push(`/dashboard?folderId=${item._id}`, {
                      scroll: false,
                    });
                  }
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-[1px] sm:top-2 right-[-4px] sm:right-2 p-1 sm:p-2 rounded hover:bg-accent">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDialogOpen(item, "rename")}
                    >
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => handleDialogOpen(item, "delete")}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {item.type === "folder" ? (
                  <div className="flex flex-col items-center justify-center gap-2 mt-2">
                    <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
                    <span className="text-sm sm:text-base font-medium break-words">
                      {item.name}
                    </span>
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
