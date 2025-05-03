const API_ROUTES = {
  auth: {
    signup: "/api/auth/signup",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  drive: {
    getDriveData: "/api/drive",
    renameDriveItem: "/api/drive/:id",
    deleteDriveItemWithChildren: "/api/drive/:id",
    folder: {
      create: "/api/drive/folder",
    },
    file: {
      upload: "/api/drive/file",
    },
  },
};

export default API_ROUTES;
