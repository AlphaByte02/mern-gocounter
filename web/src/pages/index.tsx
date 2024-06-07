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
    Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "../router";

import Counter from "../components/Counter";
import CounterDrawer from "../components/CounterDrawer";

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

    function handleOnClose() {
        onClose?.();
        setCounterName("");
    }

    return (
        <Dialog fullWidth={true} maxWidth="sm" open={isDialogOpen} onClose={handleOnClose}>
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
                <Button onClick={handleOnClose} color="secondary">
                    Cancella
                </Button>
                <Button onClick={onFinish} color="primary">
                    Aggiungi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const DeleteCounterDialog = ({
    isDialogOpen,
    counter,
    onConfirm,
    onClose,
}: {
    isDialogOpen: boolean;
    counter?: ICounter;
    onConfirm: () => void;
    onClose: () => void;
}) => {
    function onFinish() {
        onConfirm?.();
    }

    function handleOnClose() {
        onClose?.();
    }

    return (
        <Dialog fullWidth={true} maxWidth="sm" open={isDialogOpen} onClose={handleOnClose}>
            <DialogTitle>Elimina Counter</DialogTitle>
            <DialogContent>
                <Typography>Sei sicuro di voler eliminare &quot;{counter?.name}&quot;?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose} color="secondary">
                    Annulla
                </Button>
                <Button onClick={onFinish} color="error">
                    Cancella
                </Button>
            </DialogActions>
        </Dialog>
    );
};

function App() {
    const navigate = useNavigate();

    const [counters, setCounters] = useState<ICounter[]>([]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

    const [currentCounter, setCurrentCounter] = useState<ICounter>();

    useEffect(() => {
        axios
            .get("/api/v1/counters")
            .then(({ data }: { data: ICounter[] }) => setCounters(data))
            .catch(() => {});
    }, []);

    function handleCreateCounter(name: string) {
        axios
            .post("/api/v1/counters", { name: name })
            .then(({ data }: { data: ICounter }) => setCounters((c) => [...c, data]))
            .catch(() => {});
    }

    function handleDeleteCounter(id: string) {
        if (!id) {
            return;
        }

        axios
            .delete(`/api/v1/counters/${id}`)
            .then(() => setCounters((c) => c.filter((e) => e.id != id)))
            .catch(() => {});
    }

    function handleEditCounter(id: string) {
        if (!id) {
            return;
        }

        setIsEditDrawerOpen(true);
        setCurrentCounter(counters.find((e) => e.id === id));
    }

    return (
        <>
            <AddNewCounterDialog
                isDialogOpen={isAddDialogOpen}
                onConfirm={(name) => {
                    handleCreateCounter(name);
                    setIsAddDialogOpen(false);
                }}
                onClose={() => setIsAddDialogOpen(false)}
            />
            <DeleteCounterDialog
                isDialogOpen={isDeleteModelOpen}
                counter={currentCounter}
                onConfirm={() => {
                    handleDeleteCounter(currentCounter?.id || "");
                    setIsDeleteModelOpen(false);
                    setCurrentCounter(undefined);
                }}
                onClose={() => {
                    setIsDeleteModelOpen(false);
                    setCurrentCounter(undefined);
                }}
            />
            <CounterDrawer
                open={isEditDrawerOpen}
                counter={currentCounter}
                onClose={() => {
                    setIsEditDrawerOpen(false);
                    setCurrentCounter(undefined);
                }}
                onDelete={() => {
                    setIsEditDrawerOpen(false);
                    setIsDeleteModelOpen(true);
                }}
                onSubmit={() => {
                    setIsEditDrawerOpen(false);
                    setCurrentCounter(undefined);
                }}
            />
            <Container maxWidth="lg">
                <Grid
                    container
                    alignContent="center"
                    justifyContent="center"
                    style={{ minHeight: "100vh", padding: "1rem auto" }}
                    gap={4}
                >
                    {counters.map((counter) => (
                        <Grid xs={10} md={5} key={counter.id}>
                            <Counter id={counter.id} name={counter.name} onEdit={handleEditCounter} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Fab
                style={{ position: "fixed", right: "3%", bottom: "5%" }}
                color="primary"
                onClick={() => setIsAddDialogOpen(true)}
            >
                +
            </Fab>
            <Fab
                style={{ position: "fixed", right: "3%", bottom: "12%" }}
                color="secondary"
                onClick={() => navigate("/feed")}
            >
                ☰
            </Fab>
        </>
    );
}

export default App;
