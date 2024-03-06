import { Button, Unstable_Grid2 as Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import { Link } from "../router";
import { roundDecimal } from "../lib/helpers";

type AppProps = {
    id: string;
    name: string;
    onDelete: (id: string) => void;
};

const Counter = ({ id, name, onDelete }: AppProps) => {
    const [count, setCount] = useState(0);
    const [avg, setAvg] = useState(0);

    useEffect(() => {
        axios
            .get(`/api/v1/counters/${id}/stats`)
            .then(({ data }) => {
                setCount(data.total);
                setAvg(data.avg);
            })
            .catch(() => {});
    }, [id]);

    function submit(value: number) {
        axios
            .post("/api/v1/datas", {
                number: value,
                counterRef: id,
            })
            .then(() => setCount((c) => c + value))
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
                <Grid xs={12}>
                    <Typography variant="h4" align="center">
                        {name}
                    </Typography>
                </Grid>

                <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
                    <Button onClick={onSub} size="large" color="inherit" sx={{ fontSize: "1.5rem" }}>
                        -1
                    </Button>
                </Grid>
                <Grid xs={4}>
                    <Typography variant="h2" align="center">
                        {count}
                        <Typography align="center" style={{ color: "gray" }}>
                            (~{roundDecimal(avg, 2)}/d)
                        </Typography>
                    </Typography>
                </Grid>
                <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
                    <Button onClick={onAdd} size="large" color="inherit" sx={{ fontSize: "1.5rem" }}>
                        +1
                    </Button>
                </Grid>

                <Grid xs={12}>
                    <Typography align="center">
                        <Link to="/graph/:id" params={{ id: id.toString() }}>
                            <Button>Grafico</Button>
                        </Link>
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography align="center">
                        <Button onClick={() => onDelete(id)}>Delete</Button>
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Counter;
