import { Button, Unstable_Grid2 as Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { Link } from "../router";

import { humanizeAvg, roundDecimal } from "../lib/helpers";

type AppProps = {
    id: string;
    name: string;
    onEdit: (id: string) => void;
};

const Counter = ({ id, name, onEdit }: AppProps) => {
    const [count, setCount] = useState(0);

    const [currentAvgDisplay, setCurrentAvgDisplay] = useState<"numeric" | "human">("numeric");
    const [avg, setAvg] = useState(0.4806421152030217);

    const getAvg = useCallback((avg: number, t: "numeric" | "human" = "numeric") => {
        if (t === "numeric") {
            return `~${roundDecimal(avg, 2)}/d`;
        } else if (t === "human") {
            return `~${humanizeAvg(roundDecimal(avg, 2))}`;
        } else {
            throw new Error();
        }
    }, []);

    const setStats = useCallback(() => {
        axios
            .get(`/api/v1/counters/${id}/stats`)
            .then(({ data }) => {
                setCount(data.total);
                setAvg(data.avg);
            })
            .catch(() => {});
    }, [id]);

    useEffect(() => {
        setStats();
    }, [setStats]);

    function submit(value: number) {
        axios
            .post("/api/v1/datas", {
                number: value,
                counterRef: id,
            })
            .then(() => setStats())
            .catch(() => {});
    }

    function onSub() {
        submit(-1);
    }
    function onAdd() {
        submit(1);
    }

    function changeAvgDisplay() {
        if (currentAvgDisplay == "numeric") {
            setCurrentAvgDisplay("human");
        } else {
            setCurrentAvgDisplay("numeric");
        }
    }

    return (
        <Paper elevation={3} style={{ padding: "0.5em 1em" }}>
            <Grid container>
                <Grid xs={12} container>
                    <Grid xs={8} xsOffset={2}>
                        <Typography variant="h4" align="center">
                            {name}
                        </Typography>
                    </Grid>
                    <Grid xs={2} style={{ textAlign: "right" }}>
                        <Button sx={{ color: "#FFFFFFD9" }} color="secondary" onClick={() => onEdit(id)}>
                            ⋮
                        </Button>
                    </Grid>
                </Grid>

                <Grid xs={12} container sx={{ marginBottom: ".5rem" }}>
                    <Grid xs={3} display="flex" justifyContent="center" alignItems="center">
                        <Button onClick={onSub} size="large" color="inherit" sx={{ fontSize: "1.5rem" }}>
                            -1
                        </Button>
                    </Grid>
                    <Grid xs={6}>
                        <Typography variant="h2" align="center">
                            {count}
                            {avg && (
                                <Typography align="center" style={{ color: "gray" }}>
                                    ({getAvg(avg, currentAvgDisplay)}){" "}
                                    <Typography
                                        sx={{ cursor: "pointer", display: "inline-block" }}
                                        onClick={() => changeAvgDisplay()}
                                    >
                                        ⇆
                                    </Typography>
                                </Typography>
                            )}
                        </Typography>
                    </Grid>
                    <Grid xs={3} display="flex" justifyContent="center" alignItems="center">
                        <Button onClick={onAdd} size="large" color="inherit" sx={{ fontSize: "1.5rem" }}>
                            +1
                        </Button>
                    </Grid>
                </Grid>

                <Grid xs={12}>
                    <Typography align="center">
                        <Link to="/graph/:id" params={{ id: id.toString() }}>
                            <Button>Grafico</Button>
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Counter;
