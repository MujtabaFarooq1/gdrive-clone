import API_ROUTES from "@/constants/apiRoutes";

export const getDriveData = async (folderId) => {
  try {
    const baseUrl = API_ROUTES.drive.getDriveData;
    const url = new URL(
      baseUrl,
      typeof window === "undefined"
        ? "http://localhost"
        : window.location.origin
    );

    if (folderId) {
      url.searchParams.append("folderId", folderId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to get drive data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getDriveData error:", error);
    throw error;
  }
};

export const createFolder = async (folderName, parentId) => {
  const res = await fetch(API_ROUTES.drive.folder.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: folderName, parentId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to get create folder");
  }

  return data;
};

export const uploadFile = async (formData) => {
  const res = await fetch(API_ROUTES.drive.file.upload, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to upload file");
  }

  return data;
};
