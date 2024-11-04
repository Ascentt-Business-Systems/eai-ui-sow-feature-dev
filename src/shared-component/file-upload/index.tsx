import { Box, Button, styled, Typography, useTheme } from "@mui/material";
import { FileUploadState } from "api-store/file-upload/slice";
import FileUploadIcon from "assets/FileUploadIcon";
import { useSelector } from "react-redux";

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

const FileDrop = ({ handleClick }: any) => {
  const theme = useTheme();
  const { isUploading } = useSelector(
    (state: { fileUpload: FileUploadState }) => state.fileUpload
  );

  return (
    <Box flex={1}>
      <Button
        component="label"
        onChange={handleClick}
        variant="contained"
        tabIndex={-1}
        color={"primary"}
        sx={{ borderRadius: 20 }}
        disabled={isUploading}
        startIcon={
          <FileUploadIcon
            color={theme.palette.common.white}
            height={24}
            width={24}
          />
        }
      >
        <Typography variant="button" color={theme.palette.common.white}>
          Upload file
        </Typography>
        <VisuallyHiddenInput
          type="file"
          accept=".pdf"
          multiple
          disabled={isUploading}
        />
      </Button>
      {/* <input
        type="file"
        onChange={isUploading ? () => {} : handleClick}
        accept=".pdf"
        multiple
        disabled={isUploading}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ flex: 1 }}>
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={isUploading ? () => {} : handleDrop}
          style={{backgroundColor: isUploading ? theme.palette.action.disabled : theme.palette.common.white,}}
          className={style.dropzone}
        >
          <FileUploadIcon color={theme.palette.text.disabled} height={35} width={35} />
          <Typography
            variant="caption"
            color={theme.palette.text.disabled}
            fontWeight={"bold"}
          >
            Drag and drop PDF files to upload
          </Typography>
          <Typography
            variant="caption"
            color={theme.palette.text.disabled}
            fontWeight={"bold"}
          >
            OR
          </Typography>
          <Typography
            variant="caption"
            color={theme.palette.text.disabled}
            fontWeight={"bold"}
          >
            Click here to upload PDF files
          </Typography>
        </Box>
      </label> */}
    </Box>
  );
};

export default FileDrop;
