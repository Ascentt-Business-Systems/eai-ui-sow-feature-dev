import { Box, LinearProgress, linearProgressClasses, styled, useTheme } from "@mui/material";
import ToyotaTile from "assets/ToyotaTile";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        // [`&.${linearProgressClasses.colorPrimary}`]: {
        //   backgroundColor: theme.palette.secondary.main,
        // },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.common.white,
        },
      }));

const AppLoader = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{ backgroundColor: theme.palette.primary.main }}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <ToyotaTile height={100} width={100} color={theme.palette.common.white} />
      <Box width={"20vw"} pt={3}>
      <BorderLinearProgress />
      </Box>
    </Box>
  );
};

export default AppLoader;
