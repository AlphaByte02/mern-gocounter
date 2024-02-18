import type { ChartData, ChartOptions } from "chart.js";

import { Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";

import { Link, useParams } from "../../router";
import { daysInMonth, roundDecimal } from "../../lib/helpers";

const MONTH = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];

export default function Graph() {
    const { id } = useParams("/graph/:id");

    const [dataset, setDataset] = useState<ChartData<"bar" | "line">>({
        labels: [],
        datasets: [
            {
                label: "Tot",
                type: "bar",
                data: [],
            },
            {
                label: "Tot",
                type: "line",
                data: [],
            },
        ],
    });

    useEffect(() => {
        axios
            .get(`/api/v1/counters/${id}/data`)
            .then(({ data }) => {
                const labels = [];
                const datasets = [];

                const avgDatasetMonth: { month: number; year: number; firstday: number }[] = [];
                for (const singleData of data) {
                    const createdAt = new Date(singleData.createdAt);
                    const dateString = `${MONTH[createdAt.getMonth()]} ${createdAt.getFullYear()}`;
                    if (labels.indexOf(dateString) == -1) {
                        labels.push(dateString);
                        datasets.push(singleData.number);
                        avgDatasetMonth.push({
                            month: createdAt.getMonth(),
                            year: createdAt.getFullYear(),
                            firstday: createdAt.getDate(),
                        });
                    } else {
                        datasets[labels.indexOf(dateString)] += singleData.number;
                    }
                }

                const now = new Date();
                const datasetsavg = datasets.map((e, i) => {
                    let numDay = now.getDate();

                    // se il mese e l'anno NON sono quelli di adesso
                    if (!(now.getMonth() == avgDatasetMonth[i].month && now.getFullYear() == avgDatasetMonth[i].year)) {
                        if (i == 0) {
                            numDay =
                                daysInMonth(avgDatasetMonth[i].month, avgDatasetMonth[i].year) -
                                avgDatasetMonth[i].firstday;
                        } else {
                            numDay = daysInMonth(avgDatasetMonth[i].month, avgDatasetMonth[i].year);
                        }
                    }
                    return roundDecimal(e / numDay, 2);
                });

                setDataset({
                    labels: labels,
                    datasets: [
                        {
                            label: "TOT",
                            type: "bar",
                            data: datasets,
                        },
                        {
                            label: "AVG",
                            type: "line",
                            fill: false,
                            borderColor: "rgb(54, 162, 235)",
                            borderWidth: 2,
                            tension: 0.4,
                            data: datasetsavg,
                        },
                    ],
                });
            })
            .catch(() => {});
    }, [id]);

    const OPTIONS: ChartOptions<"bar" | "line"> = {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                suggestedMin: 0,
                beginAtZero: true,
                ticks: {
                    precision: 1,
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <Container maxWidth="lg">
            <Grid container style={{ marginBottom: "1.5rem" }}>
                <Grid xs={3}>
                    <Typography variant="h1" style={{ textAlign: "center", transform: "rotateZ(180deg)" }}>
                        <Link to="/" className="no-link">
                            &#10140;
                        </Link>
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="h1" style={{ textAlign: "center" }}>
                        Graph
                    </Typography>
                </Grid>
                <Grid xs={3} style={{ alignSelf: "center" }}></Grid>
            </Grid>

            <Grid container alignContent="center" justifyContent="center" style={{ minHeight: "70vh" }}>
                <Grid xs={12}>
                    <Chart type="bar" data={dataset} options={OPTIONS} />
                </Grid>
            </Grid>
        </Container>
    );
}
