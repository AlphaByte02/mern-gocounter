import { Modals } from "@generouted/react-router";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: "#FFFFFFD9",
            secondary: "#FFFFFFA6",
        },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <section>
                <main>
                    <Outlet />
                </main>

                <Modals />
            </section>
        </ThemeProvider>
    );
}
