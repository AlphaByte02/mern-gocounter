/* eslint-disable jsx-a11y/no-autofocus */
import type { TypographyProps } from "@mui/material";

import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface EditableTypographyProps {
    /**
     * Handler calling when the text changed
     */
    initialValue?: string;
    onChange?: (value: string) => void;
}

/**
 * Displaying like a `Typography`. But acting as an `input`
 */
const EditableTypography = ({
    initialValue,
    onChange,
    ...props
}: Omit<TypographyProps, "onChange"> & EditableTypographyProps) => {
    const [value, setValue] = useState(initialValue || "");
    const [isFieldFocused, setIsFieldFocused] = useState(false);

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue]);

    if (!isFieldFocused) {
        return (
            <Typography
                {...props}
                onClick={() => {
                    setIsFieldFocused(true);
                }}
            >
                {value}
            </Typography>
        );
    }

    return (
        <TextField
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => {
                setIsFieldFocused(false);
                onChange?.(value);
            }}
        />
    );
};

export default EditableTypography;
