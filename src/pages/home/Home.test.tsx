import { CssBaseline, ThemeProvider } from "@mui/material";
import { store } from "api-store/store";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { lightTheme } from "theme/theme";
import Home from ".";

it("Home Page renders correctly", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Provider store={store}>
          <Home />
        </Provider>
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});