import type { ChartData, ChartOptions } from "chart.js";
import type { IData } from "../../lib/models";

import { CircularProgress, Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import axios from "axios";
import { Chart as ChartJs } from "chart.js";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
ChartJs.register(zoomPlugin);

import ButtonGroupRadio from "../../components/ButtonGroupRadio";
import IF from "../../components/IF";

import { dateRange, daysInMonth, roundDecimal } from "../../lib/helpers";

import { Link, useParams } from "../../router";

const MONTH = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
function MonthGraph({ data }: { data: IData[] }) {
    const dataset = useMemo<ChartData<"bar" | "line">>(() => {
        const labels = [];
        const ds = [];

        const avgDatasetMonth: { month: number; year: number; firstday: number }[] = [];
        for (const singleData of data) {
            const createdAt = new Date(singleData.createdAt);
            const dateString = `${MONTH[createdAt.getMonth()]} ${createdAt.getFullYear()}`;
            if (labels.indexOf(dateString) == -1) {
                labels.push(dateString);
                ds.push(singleData.number);
                avgDatasetMonth.push({
                    month: createdAt.getMonth(),
                    year: createdAt.getFullYear(),
                    firstday: createdAt.getDate(),
                });
            } else {
                ds[labels.indexOf(dateString)] += singleData.number;
            }
        }

        const now = new Date();
        const datasetsavg = ds.map((e, i) => {
            let numDay = now.getDate();

            // se il mese e l'anno NON sono quelli di adesso
            if (!(now.getMonth() == avgDatasetMonth[i].month && now.getFullYear() == avgDatasetMonth[i].year)) {
                if (i == 0) {
                    numDay =
                        daysInMonth(avgDatasetMonth[i].month, avgDatasetMonth[i].year) - avgDatasetMonth[i].firstday;
                } else {
                    numDay = daysInMonth(avgDatasetMonth[i].month, avgDatasetMonth[i].year);
                }
            }
            return roundDecimal(e / numDay, 2);
        });

        return {
            labels: labels,
            datasets: [
                {
                    label: "TOT",
                    type: "bar",
                    data: ds,
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
        };
    }, [data]);

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

    return <Chart type="bar" data={dataset} options={OPTIONS} />;
}

const WEEK = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];
function WeekGraph({ data }: { data: IData[] }) {
    const dataset = useMemo<ChartData<"bar">>(() => {
        const ds = new Array(WEEK.length).fill(0);
        for (const singleData of data) {
            const weekday = new Date(singleData.createdAt).getDay();
            ds[weekday] = (ds[weekday] || 0) + singleData.number;
        }
        ds[ds.length] = ds[0];
        ds.shift();

        return {
            labels: WEEK,
            datasets: [{ label: "Number", data: ds }],
        };
    }, [data]);

    const OPTIONS: ChartOptions<"bar"> = {
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

    return <Chart type="bar" data={dataset} options={OPTIONS} />;
}

function DayGraph({ data }: { data: IData[] }) {
    function getDateLabel(date: Date): string {
        return (
            String(date.getDate()).padStart(2, "0") +
            "/" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "/" +
            date.getFullYear()
        );
    }

    const dataset = useMemo<ChartData<"bar">>(() => {
        const temp: { [key: string]: number } = {};
        const labels = [];
        const ds = [];

        for (const singleData of data) {
            const dateString = getDateLabel(new Date(singleData.createdAt));
            temp[dateString] = (temp?.[dateString] || 0) + singleData.number;
        }

        const range = dateRange(data[0].createdAt, new Date());
        for (const day of range) {
            const label = getDateLabel(day);
            labels.push(label);
            ds.push(temp?.[label] || 0);
        }

        return {
            labels: labels,
            datasets: [{ label: "Number", data: ds }],
        };
    }, [data]);

    const OPTIONS: ChartOptions<"bar"> = {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: { display: false },
            title: { display: false },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x",
                },
                zoom: {
                    drag: {
                        modifierKey: "ctrl",
                        enabled: true,
                    },
                    mode: "x",
                },
            },
        },
        scales: {
            y: {
                suggestedMin: 0,
                // suggestedMax: Math.max(...datasets) + 1,
                beginAtZero: true,
                ticks: {
                    precision: 1,
                    stepSize: 1,
                },
            },
        },
    };

    return <Chart type="bar" data={dataset} options={OPTIONS} />;
}

function HourGraph({ data }: { data: IData[] }) {
    function getDateLabel(date: Date): string {
        return String(date.getHours()).padStart(2, "0") + "-" + String(date.getHours() + 1).padStart(2, "0");
    }

    const dataset = useMemo<ChartData<"bar">>(() => {
        const labels = [];
        for (let i = 0; i < 24; i++) {
            labels.push(`${String(i).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);
        }
        const ds = new Array(24).fill(0);

        for (const d of data) {
            const date = new Date(d.createdAt);
            const pos = date.getHours();

            labels[pos] = getDateLabel(date);
            ds[pos] += d.number;
        }

        return {
            labels: labels,
            datasets: [{ label: "Number", data: ds }],
        };
    }, [data]);

    const OPTIONS: ChartOptions<"bar"> = {
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

    return <Chart type="bar" data={dataset} options={OPTIONS} />;
}

export default function Graph() {
    const { id } = useParams("/graph/:id");

    const ViewEnum = {
        MONTH: 1,
        WEEK: 2,
        DAY: 3,
        HOUR: 4,
    };

    const [dataset, setDataset] = useState<IData[]>([]);
    const [currentView, setCurrentView] = useState(ViewEnum.MONTH);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/v1/counters/${id}/data`)
            .then(({ data }) => {
                setDataset(data);
                setIsLoading(false);
            })
            .catch(() => {});
    }, [id]);

    return (
        <Container maxWidth="lg">
            <Grid container style={{ marginBottom: "1.5rem" }}>
                <Grid xs={3}>
                    <Typography variant="h1" sx={{ textAlign: "center", transform: "rotateZ(180deg)" }}>
                        <Link to="/" className="no-link">
                            &#10140;
                        </Link>
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="h1" sx={{ textAlign: "center" }}>
                        Graph
                    </Typography>
                </Grid>
                <Grid xs={3} sx={{ alignSelf: "center" }}>
                    <ButtonGroupRadio
                        buttons={[
                            { label: "Month", callback: () => setCurrentView(ViewEnum.MONTH) },
                            { label: "Week Day", callback: () => setCurrentView(ViewEnum.WEEK) },
                            { label: "Hour", callback: () => setCurrentView(ViewEnum.HOUR) },
                            { label: "Day", callback: () => setCurrentView(ViewEnum.DAY) },
                        ]}
                        defaultSelected={ViewEnum.MONTH - 1}
                    />
                </Grid>
            </Grid>

            <Grid container alignContent="center" justifyContent="center" style={{ minHeight: "70vh" }}>
                <Grid xs={12}>
                    <IF condition={!isLoading && currentView === ViewEnum.MONTH}>
                        <MonthGraph data={dataset} />
                    </IF>
                    <IF condition={!isLoading && currentView === ViewEnum.WEEK}>
                        <WeekGraph data={dataset} />
                    </IF>
                    <IF condition={!isLoading && currentView === ViewEnum.DAY}>
                        <DayGraph data={dataset} />
                    </IF>
                    <IF condition={!isLoading && currentView === ViewEnum.HOUR}>
                        <HourGraph data={dataset} />
                    </IF>
                    <IF condition={isLoading}>
                        <div style={{ textAlign: "center" }}>
                            <CircularProgress sx={{ marginRight: "2rem" }} />
                            <Typography
                                variant="h3"
                                sx={{ textAlign: "center", display: "inline-block", verticalAlign: "super" }}
                            >
                                Loading...
                            </Typography>
                        </div>
                    </IF>
                </Grid>
            </Grid>
        </Container>
    );
}
