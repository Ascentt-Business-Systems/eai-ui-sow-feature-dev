import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  itemContainer: {
    borderRadius: 20,
    width: "125px",
    height: "auto",
    padding: 8,
    position: "relative",
    backgroundColor: "white",
  },
  itemContainerUploading: {
    borderRadius: 20,
    width: "125px",
    height: "auto",
    padding: 8,
    position: "relative",
    backgroundColor: 'grey',
  },
  itemContainerSuccess: {
    border: "3px solid",
    borderColor: 'lightblue',
    borderOpacity: 0.2,
    borderRadius: 20,
    width: "125px",
    height: "auto",
    padding: 8,
    position: "relative",
    backgroundColor: "white",
  },
  itemContainerError: {
    border: "3px solid",
    borderColor: 'lightgray',
    borderRadius: 20,
    width: "125px",
    height: "auto",
    padding: 8,
    position: "relative",
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    cursor: "pointer",
    padding: 2
  },
  loading: {
    position: "absolute",
    top: 2.5,
    left: 2,
    cursor: "pointer",
    padding: 4
  },
  reloading: {
    position: "absolute",
    top: 2,
    left: 2,
    cursor: "pointer",
    padding: 2
  },
}));
