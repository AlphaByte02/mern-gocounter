import type { ICounter } from "../lib/models";

import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Unstable_Grid2 as Grid,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import Counter from "../components/Counter";

const AddNewCounterDialog = ({
    isDialogOpen,
    onConfirm,
    onClose,
}: {
    isDialogOpen: boolean;
    onConfirm: (name: string) => void;
    onClose: () => void;
}) => {
    const [counterName, setCounterName] = useState("");

    function onFinish() {
        onConfirm?.(counterName);
        setCounterName("");
    }

    return (
        <Dialog fullWidth={true} maxWidth="sm" open={isDialogOpen} onClose={onClose}>
            <DialogTitle>Aggiungi Counter</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="name"
                    label="Nome Counter"
                    fullWidth
                    required
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancella
                </Button>
                <Button onClick={onFinish} color="primary">
                    Aggiungi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

function App() {
    const [counters, setCounters] = useState<ICounter[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        axios
            .get("/api/v1/counters")
            .then(({ data }: { data: ICounter[] }) => setCounters(data))
            .catch(() => {});
    }, []);

    function handleCreateCounter(name: string) {
        axios
            .post("/api/v1/counters", { name: name })
            .then(({ data }) => setCounters((c) => [...c, data]))
            .catch(() => {});
    }

    return (
        <>
            <AddNewCounterDialog
                isDialogOpen={isDialogOpen}
                onConfirm={(name) => {
                    handleCreateCounter(name);
                    setIsDialogOpen(false);
                }}
                onClose={() => setIsDialogOpen(false)}
            />
            <Container maxWidth="lg">
                <Grid container alignContent="center" justifyContent="center" style={{ minHeight: "100vh" }} gap={4}>
                    {counters.map((counter) => (
                        <Grid xs={5} key={counter.id}>
                            <Counter id={counter.id} name={counter.name} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Fab
                style={{ position: "absolute", right: "3%", bottom: "5%" }}
                color="primary"
                onClick={() => setIsDialogOpen(true)}
            >
                +
            </Fab>
        </>
    );
}

export default App;
