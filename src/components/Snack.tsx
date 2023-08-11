import { FC } from "react";
import { Snackbar, Alert } from '@mui/material'

interface SnackProps {
    open?: boolean,
    onClose?: () => void,
    message?: string,
    severity?: "error" | "info" | "success" | "warning"
}

export const Snack: FC<SnackProps> = ({ open, onClose, severity, message }) => {
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={4000}
        >
            <Alert onClose={onClose} severity={severity ?? "info"} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}