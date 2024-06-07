import type { ICounter } from "../lib/models";

import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

type AppProps = {
    open: boolean;
    counter?: ICounter;
    onClose: () => void;
    onDelete: () => void;
    onSubmit: () => void;
};

const CounterDrawer = ({ open, counter, onClose, onSubmit, onDelete }: AppProps) => {
    const matches = useMediaQuery("(max-width:768px)");

    return (
        <Drawer open={open} anchor="right" onClose={onClose}>
            <Box width={matches ? "90vw" : "30vw"} height="90vh" px={4} pt={4}>
                <Typography variant="h3" align="center">
                    {counter?.name}
                </Typography>
            </Box>
            <Box px={6}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button variant="outlined" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                    <div>
                        <Stack spacing={2} direction="row">
                            <Button variant="outlined" disabled color="warning">
                                Reset
                            </Button>
                            <Button variant="outlined" disabled color="primary" onClick={onSubmit}>
                                Save
                            </Button>
                        </Stack>
                    </div>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default CounterDrawer;
