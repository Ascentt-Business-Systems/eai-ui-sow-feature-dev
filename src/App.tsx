import { InteractionStatus } from "@azure/msal-browser";
import { InteractionRequiredAuthError } from "@azure/msal-common";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { setLogoutState, setUserData } from "api-store/user-data/slice";
import Logout from "assets/Logout";
import { loginRequest } from "authConfig";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Home from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { IdleTimerProvider } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLoader from "shared-component/app-loader";
import TopAppBar from "shared-component/top-app-bar";
import { lightTheme } from "theme/theme";
import { REDIRECT_URL, SSO_CLIENT_ID } from "utility/constants";

dayjs.extend(utc);
dayjs.extend(timezone);
const utz = dayjs.tz.guess();

export default function App() {
  const [logoutPrompt, setLogoutPrompt] = useState<boolean>(false);
  const theme = useTheme()
  const { instance, accounts, inProgress } = useMsal();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    // logout redirect uri
    setLogoutState();
    await instance.logout({ postLogoutRedirectUri: REDIRECT_URL });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance]);

  useEffect(() => {
    if (inProgress === "none" && accounts.length === 0) {
      instance
        .loginRedirect(loginRequest)
        .catch((e: any) => {
          toast.error(e.message);
        });
    }
  }, [accounts.length, inProgress, instance]);

  const aquireToken = useCallback(async () => {
    const silentRequest = {
      scopes: [`${SSO_CLIENT_ID}/.default`],
      account: instance.getActiveAccount() ?? accounts[0],
    };
    const redirectRequest = {
      scopes: [`${SSO_CLIENT_ID}/.default`],
    };
    try {
      const token = await instance.acquireTokenSilent(silentRequest);
      if (
        !dayjs.utc(token.expiresOn?.toISOString()).tz(utz).isBefore(dayjs())
      ) {
        dispatch(
          setUserData({
            user_name: token?.account?.username,
            name: token?.account?.name,
            access_token: token.accessToken,
          })
        );
      } else {
        throw new Error("The token is expired!");
      }
    } catch (error: any) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          // fallback to interaction when silent call fails
          if (inProgress === InteractionStatus.None) {
            await instance.acquireTokenRedirect(redirectRequest);
          }
        } catch (e: any) {
          return null;
        }
      }
      handleLogout();
    }
  }, [accounts, dispatch, instance, inProgress, handleLogout]);

  // get username, name, accesstoken, userID
  useEffect(() => {
    if (accounts.length > 0) {
      aquireToken();
    }
  }, [accounts, aquireToken]);

  return (
    <IdleTimerProvider
      timeout={1000 * 60 * 20}
      onIdle={() => setLogoutPrompt(true)}
    >
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {/* <AuthenticatedTemplate>
          <Box sx={{ display: "flex" }} id={"screen"}>
            <TopAppBar
              logout={() => {
                handleLogout();
              }}
            />
            <Box
              sx={{
                width: "100%",
                maxHeight: `calc(100vh - 80px)`,
                height: `calc(100vh - 80px)`,
                minHeight: `calc(100vh - 80px)`,
                padding: "1%",
                marginTop: "80px",
                // backgroundColor: "#ececec",
              }}
            >
              <Home />
            </Box>
            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={true}
              limit={3}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              theme={"colored"}
            />
          </Box>
        </AuthenticatedTemplate> */}
        <Dialog
          open={logoutPrompt}
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: theme.palette.common.white, // Change background color here
            },
          }}
        >
          <DialogContent>
            <Typography>
              The session is timed-out. You will be logged out!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<Logout color={theme.palette.common.white} />}
              variant="contained"
              onClick={() => {
                handleLogout();
              }}
              style={{
                marginLeft: 10,
                borderRadius: 20,
                color: theme.palette.common.white,
                fontWeight: "bold",
              }}
            >
              OK
            </Button>
            {/* </Box> */}
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </IdleTimerProvider>
  );
}
