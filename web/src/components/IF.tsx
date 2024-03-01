import { memo, type ReactElement } from "react";

const IF = memo(
    function IF({ children, condition }: { children: ReactElement; condition: boolean }) {
        return condition ? children : null;
    },
    (props, oldProps) => props.condition === oldProps.condition
);

// eslint-disable-next-line react-refresh/only-export-components
export default IF;
