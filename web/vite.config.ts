import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), generouted()],
    server: {
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components",
            "@lib": "/src/lib",
        },
    },
});
