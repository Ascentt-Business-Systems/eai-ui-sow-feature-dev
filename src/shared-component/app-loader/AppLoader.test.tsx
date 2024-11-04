import { CssBaseline, ThemeProvider } from "@mui/material";
import renderer from "react-test-renderer";
import { lightTheme } from "theme/theme";
import AppLoader from ".";

it("App Loader renders correctly", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
          <AppLoader />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});