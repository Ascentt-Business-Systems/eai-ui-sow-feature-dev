import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: any) => ({
  container: {
    display: "flex",
    height: "100%",
  },
  sideMenu: {
    flex: 0.2,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  mainContainer: {
    flex: 1,
    height: "100vh",
    overflowY: "auto",
    background: "linear-gradient(180deg, #da291c 35%, #f0f0f0 20%)",
  },
}));
