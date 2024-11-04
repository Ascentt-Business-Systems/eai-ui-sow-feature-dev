import { Close, ReplayRounded } from "@mui/icons-material";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import uploadQueueActions from "api-store/file-upload/action";
import PDFFile from "assets/PDFFile";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useStyles } from "./style";

const FileItem = ({
  name,
  size,
  removeFile,
  id,
  doc,
  status,
}: {
  name: string;
  size: string;
  removeFile: () => void;
  id: number;
  doc: File;
  status: "pending" | "uploading" | "success" | "error";
}) => {
  const style = useStyles();
  const dispatch = useDispatch();
  const [uploadStatus, setUploadStatus] = useState<
    "pending" | "uploading" | "success" | "error"
  >("pending");

  useEffect(() => {
    setUploadStatus(status);
  }, [status]);

  const handleReupload = () => {
    dispatch(uploadQueueActions.uploadFile({ file: { doc, id } }));
  };

  return (
    <Grid
      item
      className={
        uploadStatus === "success"
          ? style.itemContainerSuccess
          : uploadStatus === "error"
            ? style.itemContainerError
            : uploadStatus === "uploading"
              ? style.itemContainerUploading
              : style.itemContainer
      }
    >
      {uploadStatus === "uploading" ? (
        <Box className={style.loading}>
          <CircularProgress size={"20px"} />
        </Box>
      ) : null}
      {uploadStatus === "error" ? (
        <Box className={style.reloading} onClick={handleReupload}>
          <ReplayRounded color="disabled" />
        </Box>
      ) : null}

      {uploadStatus === "error" || uploadStatus === "success" ? (
        <Box className={style.closeButton} onClick={removeFile}>
          <Close color="disabled" />
        </Box>
      ) : null}
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <PDFFile
          height={40}
          width={40}
        />
        <Typography
          variant="caption"
          width={"100%"}
          textAlign={"center"}
          fontWeight={"bold"}
          style={{ textWrap: "wrap", wordWrap: "break-word" }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          width={"100px"}
          textAlign={"center"}
          style={{ textWrap: "wrap", wordWrap: "break-word" }}
        >
          {size}
        </Typography>
      </Box>
    </Grid>
  );
};

export default FileItem;
