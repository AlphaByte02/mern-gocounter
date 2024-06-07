import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";
import { Outlet } from "react-router-dom";

let darkTheme = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: "#FFFFFFD9",
            secondary: "#FFFFFFA6",
        },
    },
});
darkTheme = responsiveFontSizes(darkTheme, { factor: 4 });

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <section>
                <main>
                    <Outlet />
                </main>
            </section>
        </ThemeProvider>
    );
}
