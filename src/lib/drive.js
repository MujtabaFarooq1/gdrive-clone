import API_ROUTES from "@/constants/apiRoutes";
import { apiRequest } from "@/lib/apiRequest";

export const getDriveData = (folderId) => {
  const baseUrl = API_ROUTES.drive.getDriveData;
  const origin =
    typeof window === "undefined" ? "http://localhost" : window.location.origin;

  const url = new URL(baseUrl, origin);
  if (folderId) {
    url.searchParams.append("folderId", folderId);
  }

  return apiRequest(
    url.toString(),
    {},
    {
      defaultErrorMessage: "Failed to fetch drive data",
      showSuccessToast: false,
    }
  );
};

export const createFolder = (folderName, parentId) =>
  apiRequest(
    API_ROUTES.drive.folder.create,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName, parentId }),
    },
    {
      successMessage: "Folder created successfully",
      defaultErrorMessage: "Failed to create folder",
    }
  );

export const uploadFile = (formData) =>
  apiRequest(
    API_ROUTES.drive.file.upload,
    {
      method: "POST",
      body: formData,
    },
    {
      successMessage: "File uploaded successfully",
      defaultErrorMessage: "Failed to upload file",
    }
  );

export const renameDriveItem = (id, name) =>
  apiRequest(
    API_ROUTES.drive.renameDriveItem.replaceAll(":id", id),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    },
    {
      successMessage: "Renamed successfully",
      defaultErrorMessage: "Failed to rename item",
    }
  );

export const deleteDriveItemAndItsChildren = (id) =>
  apiRequest(
    API_ROUTES.drive.deleteDriveItemWithChildren.replaceAll(":id", id),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
    {
      successMessage: "Item deleted successfully",
      defaultErrorMessage: "Failed to delete item",
    }
  );
