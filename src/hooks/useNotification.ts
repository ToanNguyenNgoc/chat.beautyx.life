import { AlertColor } from "@mui/material";
import { useState } from "react";

interface Notification {
    load: boolean,
    message: string,
    openAlert: boolean,
    element?: React.ReactElement,
    color?: AlertColor
}

interface ResultOptions {
    message?: string;
    element?: React.ReactElement;
    color?: AlertColor
}

export function useNotification() {
    const [notification, setNotification] = useState<Notification>({
        load: false,
        message: "",
        openAlert: false,
        color: 'info'
    })
    const firstLoad = () => setNotification({ ...notification, load: true })
    const resultLoad = (options: ResultOptions) => {
        setNotification({
            load: false,
            message: options.message ?? '',
            openAlert: true,
            element: options.element,
            color: options.color
        })
    }
    const onCloseNotification = () => setNotification({ ...notification, openAlert: false })
    return { notification, firstLoad, resultLoad, onCloseNotification }
}