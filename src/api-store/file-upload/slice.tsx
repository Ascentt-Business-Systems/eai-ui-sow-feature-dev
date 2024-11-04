import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import uploadQueueActions from "./action";

export type FileUpload = {
  id: number;
  doc: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  filePath?: string;
};

export type FileUploadState = {
  files: FileUpload[];
  totalFileSize: number;
  filesUploadedCount: number;
  isUploading: boolean;
  isDeleting: boolean;
  submitRequest: {
    fileList: string[];
    contract_type: string;
    isLoading: boolean;
    error: string;
  };
};

const initialState: FileUploadState = {
  files: [],
  totalFileSize: 0,
  filesUploadedCount: 0,
  isUploading: false,
  isDeleting: false,
  submitRequest: {
    fileList: [],
    contract_type: "sow",
    isLoading: false,
    error: "",
  },
};

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    calculateTotalFileSize: (state) => {
      if (state.files.length) {
        let fSize: number = 0;
        state.files.forEach((file) => {
          if (fSize + parseFloat((file.doc.size / 1048576).toFixed(2)) <= 25)
            fSize += parseFloat((file.doc.size / 1048576).toFixed(2));
        });
        state.totalFileSize = parseFloat(fSize.toFixed(2));
      } else {
        state.totalFileSize = 0;
      }
    },
    addFile: (state, action: PayloadAction<{ file: File }>) => {
      state.files.push({
        id: state.files.length, // Generate unique ID
        doc: action.payload.file,
        status: "pending",
        progress: 0,
      });
      fileUploadSlice.caseReducers.calculateTotalFileSize(state);
    },
    updateUploadedFilesCount: (
      state,
      action: PayloadAction<{ count: number }>
    ) => {
      state.filesUploadedCount = action.payload.count;
    },
    updateQueueStaus: (state, action) => {
      state.isUploading = action.payload;
    },
    updateFileStatus: (
      state,
      action: PayloadAction<{
        fileId: number;
        status: FileUpload["status"];
        filePath?: string;
      }>
    ) => {
      const { fileId, status, filePath } = action.payload;
      const file = state.files.find((file) => file.id === fileId);
      if (file) {
        file.status = status;
        file.filePath = filePath ?? "";
        if (file.status === "success") {
          state.filesUploadedCount += 1;
        }
      }
    },
    updateFileProgress: (
      state,
      action: PayloadAction<{ fileId: number; progress: number }>
    ) => {
      const { fileId, progress } = action.payload;
      const file = state.files.find((file) => file.id === fileId);
      if (file) {
        file.progress = progress;
      }
    },
    updateDeleteStatus: (state, action:PayloadAction<boolean>) => {
      state.isDeleting = action.payload
    },
    deleteFile: (state, action: PayloadAction<{ fileId: number }>) => {
      const fileIdToDelete: number = action.payload.fileId;
      state.files = state.files.filter((file) => file.id !== fileIdToDelete);
      state.filesUploadedCount = state.files.length
      fileUploadSlice.caseReducers.calculateTotalFileSize(state);
    },
    updateContractType: (state, action: PayloadAction<string>)=> {
      state.submitRequest.contract_type = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadQueueActions.submitRequest.fulfilled, (state, action) => {
        state.submitRequest.fileList = [];
        state.files = [];
        state.totalFileSize = 0;
        state.submitRequest.isLoading = false;
        toast.success(action.payload);
      })
      .addCase(uploadQueueActions.submitRequest.pending, (state) => {
        state.submitRequest.isLoading = true;
      })
      .addCase(uploadQueueActions.submitRequest.rejected, (state, action) => {
        toast.error(action.error.message);
        state.submitRequest.error = action.error.message;
        state.submitRequest.isLoading = false;
      });
  },
});

export const {
  addFile,
  updateFileStatus,
  updateFileProgress,
  deleteFile,
  updateUploadedFilesCount,
  updateQueueStaus,
  updateDeleteStatus,
  updateContractType
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
