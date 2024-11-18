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
import FileUpload from "shared-component/file-upload";
import FileItem from "shared-component/file-item";
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

  useEffect(() => {
    if (accounts.length > 0) {
      aquireToken();
    }
  }, [accounts, aquireToken]);

  return (
    <Box sx={{display:'flex', flexDirection:'column'}}>
      <TopAppBar
        logout={() => {
          handleLogout();
        }}
      />
      <Box sx={{marginTop:'130px',marginLeft:'50px', display:'flex',flexDirection:'row'}}>
        <Home/>
      </Box>
    </Box>
  );
}
