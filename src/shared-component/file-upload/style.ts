import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
    border: "3px dashed",
    borderColor: theme.palette.action.disabled,
    borderRadius: 20,
    backgroundColor: "white",
    cursor: "pointer"
  },
}));
