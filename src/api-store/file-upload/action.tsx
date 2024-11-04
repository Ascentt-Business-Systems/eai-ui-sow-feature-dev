import { createAsyncThunk } from "@reduxjs/toolkit";
import { userDataState } from "api-store/user-data/slice";
import { toast } from "react-toastify";
import { EAIAxios, QUEUESIZE } from "utility/constants";
import {
  FileUpload,
  FileUploadState,
  deleteFile,
  updateDeleteStatus,
  updateFileProgress,
  updateFileStatus,
  updateQueueStaus,
} from "./slice";

// Thunk action to upload files in a queue of 10
let isUploading = false;
const uploadFilesInQueue = createAsyncThunk(
  "uploadFilesInQueue",
  async (_, { getState, dispatch }) => {
    if (isUploading) {
      return; // Exit if upload is already in progress
    }

    isUploading = true;
    dispatch(updateQueueStaus(isUploading));
    try {
      const queueSize = QUEUESIZE;
      let filesUploaded = 0;
      const { fileUpload } = getState() as {
        fileUpload: FileUploadState;
      };
      if (fileUpload.files.length > 0) {
        let pendingFiles = fileUpload.files.filter(
          (file) => file.status === "pending"
        );
        while (filesUploaded < pendingFiles.length) {
          const filesToUpload = pendingFiles.slice(
            filesUploaded,
            filesUploaded + queueSize
          );
          filesToUpload.forEach((file) => {
            dispatch(
              updateFileStatus({
                fileId: file.id,
                status: "uploading",
                filePath: file.filePath,
              })
            );
          });
          await Promise.all(
            filesToUpload.map((file) => dispatch(uploadFile(file)))
          );

          pendingFiles = fileUpload.files.filter(
            (file) => file.status === "pending"
          );
          if (pendingFiles.length === 0) {
            break; // No more pending files, exit the loop
          }

          filesUploaded += queueSize;
        }
      }
    } finally {
      isUploading = false;
      dispatch(updateQueueStaus(isUploading));
    }
  }
);

// Thunk action to upload a single file
const uploadFile = createAsyncThunk(
  "uploadFile",
  async (file: { doc: File; id: number }, { getState, dispatch }) => {
    const { userData } = getState() as {
      userData: userDataState;
    };
    try {
      dispatch(updateFileStatus({ fileId: file.id, status: "uploading" }));
      const formData = new FormData();
      formData.append("file", file.doc);

      const response = await EAIAxios.post("/upload", formData, {
        headers: {
          // Authorization: `${userData?.access_token}`,
          authorizationtoken: `${userData?.access_token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.doc.size;
          const progress = Math.round((progressEvent.loaded / total) * 100);
          dispatch(updateFileProgress({ fileId: file.id, progress }));
        },
      });

      if (response.status === 200) {
        dispatch(
          updateFileStatus({
            fileId: file.id,
            status: "success",
            filePath: response.data.filepath,
          })
        );
      } else {
        dispatch(updateFileStatus({ fileId: file.id, status: "error" }));
      }
    } catch (error) {
      dispatch(updateFileStatus({ fileId: file.id, status: "error" }));
    }
  }
);

const deleteSelectedFile = createAsyncThunk(
  "deleteSelectedFile",
  async (
    file: { filePath: string; id: number; status: string },
    { dispatch, getState }
  ) => {
    dispatch(updateDeleteStatus(true))
    // dispatch(addFile({ file: file.doc, id: file.id }));
    const { userData } = getState() as {
      userData: userDataState;
    };
    if (file.status === "success") {
      try {
        const response = await EAIAxios.delete("/file-delete", {
          params: { file_path: file.filePath },
          headers: {
            authorizationtoken: `${userData?.access_token}`,
            // Authorization: `${userData?.access_token}`,
          },
        });

        if (response.status === 200) {
          dispatch(deleteFile({ fileId: file.id }));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          toast.error((error as any).response.data.message);
          dispatch(updateDeleteStatus(false))
        }
        // toast.error(error.message)
        // dispatch(updateFileStatus({ fileId: file.id, status: "error" }));
      } finally {
        dispatch(updateDeleteStatus(false))
      }
    } else {
      dispatch(deleteFile({ fileId: file.id }));
      dispatch(updateDeleteStatus(false))
    }
  }
);

// Thunk action to upload files in a queue of 10
let isDeleting = false;
const deleteFilesInQueue = createAsyncThunk(
  "deleteFilesInQueue",
  async (_, { getState, dispatch }) => {
    if (isDeleting) {
      return; // Exit if upload is already in progress
    }
    
    dispatch(updateDeleteStatus(true))
    isDeleting = true;
    try {
      const queueSize = 3;
      let filesDeleted = 0;
      const { fileUpload } = getState() as {
        fileUpload: FileUploadState;
      };
      if (fileUpload.files.length > 0) {
        while (filesDeleted < fileUpload.files.length) {
          const filesToDelete = fileUpload.files.slice(
            filesDeleted,
            filesDeleted + queueSize
          );
          await Promise.all(
            filesToDelete.map((file) => dispatch(deleteAllFile(file)))
          );

          filesDeleted += queueSize;
        }
      }
    } finally {
      dispatch(updateDeleteStatus(false))
      isDeleting = false;
    }
  }
);

const deleteAllFile = createAsyncThunk(
  "deleteAllFile",
  async (file: FileUpload, { getState, dispatch }) => {
    try {
      const { userData } = getState() as {
        userData: userDataState;
      };
      if (file.status === "success") {
        const response = await EAIAxios.delete("/file-delete", {
          params: { file_path: file.filePath },
          headers: {
            authorizationtoken: `${userData?.access_token}`,
            // Authorization: `${userData?.access_token}`,
          },
        });

        if (response.status === 200) {
          dispatch(deleteFile({ fileId: file.id }));
        }
      } else {
        dispatch(deleteFile({ fileId: file.id }));
      }
    } catch (error) {}
  }
);

const submitRequest = createAsyncThunk(
  "submitRequest",
  async (_, { getState }) => {
    const { userData, fileUpload, } = getState() as {
      userData: userDataState;
      fileUpload: FileUploadState;
    };
    try {
      const list = fileUpload.files.map((file) => file.filePath);
      const response = await EAIAxios.post(
        "/process",
        { file_paths: list, contract_type: fileUpload.submitRequest.contract_type },
        {
          headers: {
            // Authorization: `${userData.access_token}`,
            authorizationtoken: `${userData?.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data.message;
      }
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk action creator to upload a set of items
const uploadSet = createAsyncThunk(
  "uploadSet",
  async (set: FileUpload[], { dispatch }) => {
    // Simulate upload process
    await uploadSetToServer(set, dispatch);
    // Return the uploaded set
    return set;
  }
);

// Function to simulate uploading a set of items to the server
const uploadSetToServer = async (set: FileUpload[], dispatch: any) => {
  // Simulate upload process (e.g., using Axios, Fetch, etc.)
  set.forEach((file) => {
    dispatch(
      updateFileStatus({
        fileId: file.id,
        status: "uploading",
        filePath: file.filePath,
      })
    );
  });
  // Simulate delay (replace with actual upload logic)
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const uploadQueueActions: any = {
  uploadFilesInQueue,
  uploadFile,
  deleteSelectedFile,
  deleteAllFile,
  submitRequest,
  deleteFilesInQueue,

  uploadSet,
};

export default uploadQueueActions;
