import type { SwitchProps as MUISwitchProps } from "@mui/material";

import { Switch as MUISwitch, Stack, Typography } from "@mui/material";

interface SwitchProps extends MUISwitchProps {
    prelabel: string;
    postlabel: string;
}

export default function Switch({ prelabel, postlabel, ...props }: SwitchProps) {
    return (
        <Stack direction="row" component="label" alignItems="center" justifyContent="center">
            <Typography>{prelabel}</Typography>
            <MUISwitch {...props} />
            <Typography>{postlabel}</Typography>
        </Stack>
    );
}
