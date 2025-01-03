import type { CSSProperties } from "react";

import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";

type ButtonGroupRadioProps = {
    buttons: { label: string; callback?: () => void }[];
    defaultSelected: number;
    style?: CSSProperties;
    className?: string;
    disabled?: boolean;
};

export default function ButtonGroupRadio({
    buttons,
    disabled,
    defaultSelected,
    style,
    className,
}: ButtonGroupRadioProps) {
    const [indexSelected, setIndexSelected] = useState(defaultSelected);

    function onClickButton(id: number) {
        setIndexSelected(id);
        buttons?.[id]?.callback?.();
    }

    return (
        <ButtonGroup color="primary" style={style} className={className}>
            {buttons?.map((e, i) => (
                <Button
                    key={i}
                    variant={i === indexSelected ? "contained" : "outlined"}
                    color="primary"
                    disabled={disabled}
                    onClick={() => onClickButton(i)}
                >
                    {e.label}
                </Button>
            ))}
        </ButtonGroup>
    );
}
