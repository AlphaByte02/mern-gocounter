import type { AvgDisplayType } from "@lib/models";

import { Box, Button, CircularProgress, Unstable_Grid2 as Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { humanizeAvg, roundDecimal } from "@lib/helpers";

import IF from "@components/IF";

import { Link } from "@/router";

type CounterProps = {
    id: string;
    name: string;
    avgDisplay: AvgDisplayType;
    global?: boolean;
    onEdit: (id: string) => void;
};

const Counter = ({ id, name, avgDisplay = "numeric", global = false, onEdit }: CounterProps) => {
    const [isLoading, setIsLoading] = useState(true);

    const [count, setCount] = useState(0);

    const [avg, setAvg] = useState(0);

    const getAvg = useCallback(
        (avg: number) => {
            if (avgDisplay === "numeric") {
                return `~${roundDecimal(avg, 2)}/d`;
            } else if (avgDisplay === "human") {
                return `~${humanizeAvg(roundDecimal(avg, 3))}`;
            } else {
                throw new Error();
            }
        },
        [avgDisplay]
    );

    const setStats = useCallback(() => {
        setIsLoading(true);
        axios
            .get(`/api/v1/counters/${id}/stats`, { params: { global: global } })
            .then(({ data }) => {
                setCount(data.total);
                setAvg(data.avg);
            })
            .catch(() => {})
            .finally(() => {
                setIsLoading(false);
            });
    }, [global, id]);

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
                        {!isLoading && (
                            <Typography variant="h2" align="center">
                                {count}
                                {avg !== undefined && (
                                    <Typography align="center" style={{ color: "gray" }}>
                                        ({getAvg(avg)})
                                    </Typography>
                                )}
                            </Typography>
                        )}
                        <IF condition={isLoading}>
                            <Box width="min-content" mx="auto" mt={2}>
                                <CircularProgress />
                            </Box>
                        </IF>
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
