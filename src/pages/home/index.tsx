import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  SelectChangeEvent,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import uploadQueueActions from "api-store/file-upload/action";
import {
  addFile,
  FileUpload,
  FileUploadState,
  updateContractType,
} from "api-store/file-upload/slice";
import ClearFiles from "assets/ClearFiles";
import Process from "assets/Process";
import Upload from "assets/Upload";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileItem from "shared-component/file-item";
import FileDrop from "shared-component/file-upload";
import { MAXFILESIZE } from "utility/constants";


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Home = () => {
  const [pendingFiles, setPendingFiles] = useState<FileUpload[]>([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { files, totalFileSize, submitRequest, isUploading, isDeleting } =
    useSelector((state: { fileUpload: FileUploadState }) => state.fileUpload);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sFiles = event.target.files;

    // Check if files are PDFs (optional)
    if (sFiles && sFiles.length > 0) {
      let totalSize: number = 0;
      Array.from(sFiles).forEach((file: File) => {
        totalSize += parseFloat((file.size / 1048576).toFixed(2));
      });

      const previouseFiles = files?.map((file) => file.doc.name);
      if (totalSize + totalFileSize <= MAXFILESIZE) {
        Array.from(sFiles).forEach((file: File, index: number) => {
          if (
            file?.type === "application/pdf" &&
            !previouseFiles?.includes(file.name)
          ) {
            dispatch(
              addFile({
                file: file,
              })
            );
          } else {
            toast.warning("Please select PDF files only!");
          }
        });
      } else {
        toast.error(
          `Total file size exceeded! (${(totalSize + totalFileSize).toFixed(
            2
          )}/${MAXFILESIZE})`
        );
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Fetch the files
    const sFiles = Array.from(event.dataTransfer.files);

    // Check if files are PDFs (optional)
    if (sFiles && sFiles.length > 0) {
      let totalSize: number = 0;
      Array.from(sFiles).forEach((file: File) => {
        totalSize += parseFloat((file.size / 1048576).toFixed(2));
      });

      const previouseFiles = files?.map((file) => file.doc.name);
      if (totalSize + totalFileSize <= MAXFILESIZE) {
        Array.from(sFiles).forEach((file: File, index: number) => {
          if (
            file?.type === "application/pdf" &&
            !previouseFiles?.includes(file.name)
          ) {
            dispatch(
              addFile({
                // id: `${index}`,
                file: file,
              })
            );
          } else {
            toast.warning("Please select PDF files only!");
          }
        });
      } else {
        toast.error(
          `Total file size exceeded! (${(totalSize + totalFileSize).toFixed(
            2
          )}/${MAXFILESIZE})`
        );
      }
    }
  };

  // Trigger API from here
  const handleUpload = () => {
    dispatch(uploadQueueActions.submitRequest());
  };

  useEffect(() => {
    setPendingFiles(files.filter((f) => f.status === "pending"));
  }, [files]);

  useEffect(() => {
    if (pendingFiles.length > 0) {
      dispatch(uploadQueueActions.uploadFilesInQueue());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFiles.length]);

  const handleRemoveFile = ({
    path,
    id,
    status,
  }: {
    path?: string;
    id: number;
    status: string;
  }) => {
    dispatch(
      uploadQueueActions.deleteSelectedFile({
        filePath: path,
        id,
        status,
      })
    );
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow for a drop
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleContractChange = (event: SelectChangeEvent) => {
    dispatch(updateContractType(event.target.value))
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={isUploading ? () => {} : handleDrop}
    >
      <Box display={"flex"} gap={1.5} p={1}>
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          gap={1.5}
          justifyContent={"flex-start"}
        >
          <FileDrop />
        </Box>
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={1}
        >
          <Box display={"flex"} alignItems={"baseline"}>
            <Typography variant="caption">
              {`Total Size: ${totalFileSize.toFixed(
                2
              )}MB / Max Size: ${MAXFILESIZE}MB`}
            </Typography>
            <Typography p={1}>|</Typography>
            <Typography variant="caption">
              {`Total Files: ${files.length}`}
            </Typography>
          </Box>

          <Button
            variant="text"
            onClick={() => {
              dispatch(uploadQueueActions.deleteFilesInQueue());
            }}
            style={{
              width: "100px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
            }}
            disabled={
              files.length === 0 ||
              files.filter((f) => f.status !== "success").length > 0 ||
              isDeleting
            }
          >
            <ClearFiles
              height={20}
              width={20}
              style={{ marginRight: "5px" }}
              color={
                files.length === 0 ||
                files.filter((f) => f.status !== "success").length > 0 ||
                isDeleting
                  ? theme.palette.action.disabled
                  : theme.palette.primary.main
              }
            />
            <Typography variant="button" fontWeight={"bold"}>
              Clear
            </Typography>
          </Button>
          {files?.length ? (
            <LoadingButton
              loading={submitRequest.isLoading}
              onClick={handleUpload}
              loadingPosition="start"
              startIcon={<Process color={theme.palette.common.white} />}
              variant="contained"
              disabled={files.filter((f) => f.status !== "success").length > 0}
              sx={{ borderRadius: 20 }}
            >
              <Typography
                variant="button"
                fontWeight={"bold"}
                color={theme.palette.common.white}
              >
                Process All PDFs
              </Typography>
            </LoadingButton>
          ) : null}
        </Box>
      </Box>
      <VisuallyHiddenInput
        type="file"
        accept=".pdf"
        multiple
        disabled={isUploading}
      />
    </Box>
  );
};

export default Home;
