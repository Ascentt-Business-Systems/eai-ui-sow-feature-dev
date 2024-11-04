import { configureStore } from "@reduxjs/toolkit";
import fileUploadReducer from "./file-upload/slice";
import userDataReducer from "./user-data/slice";

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    // uploadDoc: uploadDocReducer
    fileUpload: fileUploadReducer,
  },
});

// let isDispatchingUpload = false;
// let isUploading = false;

// store.subscribe(async() => {
  
//   // const pendingFiles = fileUpload.files.filter((f) => f.status === "pending");
  
//   if (isUploading) {
//     return; // Exit if upload is already in progress
//   }

//   isUploading = true;
//   try {
//     const queueSize = QUEUESIZE;
//     let filesUploaded = 0;
//     const { fileUpload } = store.getState() as {
//       fileUpload: FileUploadState;
//     };
//     if (fileUpload.files.length > 0) {
//       const pendingFiles = fileUpload.files.filter(
//         (file) => file.status === "pending"
//       );
//       while (filesUploaded < pendingFiles.length) {
//         const filesToUpload = pendingFiles.slice(
//           filesUploaded,
//           filesUploaded + queueSize
//         );
        
//         filesToUpload.forEach((file) => {
//           store.dispatch(
//             updateFileStatus({
//               fileId: file.id,
//               status: "uploading",
//               filePath: file.filePath,
//             })
//           );
//         });
//         await Promise.all(
//           filesToUpload.map((file) => store.dispatch(uploadQueueActions.uploadFile({ doc: file.doc, id: file.id })))
//         );
//         filesUploaded += queueSize;
//       }
//     }
//   } finally {
//     isUploading = false;
//   }
//   // if (pendingFiles.length > 0) {
//     // isDispatchingUpload = true;

//     // pendingFiles.forEach((file) => {
//     //   store.dispatch(
//     //     uploadQueueActions.uploadFile({ doc: file.doc, id: file.id })
//     //   );
//     // });
//     // isDispatchingUpload = false;
//   // }
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
