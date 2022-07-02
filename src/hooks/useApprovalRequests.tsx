import { useState, useEffect } from "react";
import notifyAPI from "../api/notifyAPI";
import { Notification } from '../interfaces/NotificationInterface';

type ItemNotificacion = {
    id: string,
    notificacion: Notification;
}

export const useApprovalRequests = (idUser:string, idFilterType:string) => {
    const [approvals, setApprovals] = useState<ItemNotificacion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getDetails = async() => {
        const approvalsRequestsPromise = await notifyAPI.get('/api/notification/GetNotificationsByUser',{
            params: {
                idEmpleado: idUser,
                top: 0,
                filtro: idFilterType,
                fechaIni: '20210101',
                fechaFin: '20220419',
                busqueda: 1,
                idEmpresaC: 0,
                idSucursalC: 0,
                idDepartamento: 0
            }
        });
        const [approvalsRequestsResp] = await Promise.all([approvalsRequestsPromise]);
        setApprovals(approvalsRequestsResp.data);
        setIsLoading(false);
    }
    useEffect(() => {
        getDetails();
    }, []);

    return {
        isLoading,
        approvals
    }

}
