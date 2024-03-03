import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
