# Google Drive Clone

This project is a simplified clone of Google Drive, built with **Next.js**, **Node.js**, **MongoDB**, and **Cloudinary** for file storage. It includes core features such as file upload, folder management, user authentication, and protected routes.

## Tech Stack

- **Frontend**: React.js + Next.js (App Router)
- **Backend**: Node.js (Next.js API Routes)
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Authentication**: Custom JWT Authentication
- **Styling**: Tailwind CSS, ShadCN UI

## Features

### ✅ Main Features

- **User Authentication**: 
  - Sign up, Log in, Log out
  - Protected routes for file access
  - JWT-based authentication stored in HTTP-only cookies
  
- **File and Folder System**: 
  - Create folders
  - Upload files to folders
  - View file/folder structure (tree or list)

- **File Management**: 
  - Rename and delete files/folders
  - Basic file preview (PDF, image, file info)

- **User-specific Storage**: 
  - Each user can only access their own files and folders
  
- **Responsive UI**: 
  - Mobile & desktop friendly design

### ⚠️ Common Pitfalls / Warnings

- Do not store actual files in the database — only store metadata.
- Protected routes for secure file uploads.
- Handle CORS issues if frontend/backend are separate.
- Test for upload limits and file size handling.

## Getting Started

To run the development server, use the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
