import {useState, useEffect} from 'react';
import notifyAPI from '../api/notifyAPI';
import { NotTypeCard } from '../interfaces/NotificationInterface';

export const useResumenNotifications = (idUsuario:string) => {
    /*
    const DATA:NotTypeCard[] = [];

    {
        "idUser": "71",
        "idFilterType": "0",
        "filterName": "Todos",
        "notificationsNumber": "2050"
    },
    {
        "idUser": "71",
        "idFilterType": "2",
        "filterName": "Cotizaciones",
        "notificationsNumber": "7"
    },
    {
        "idUser": "71",
        "idFilterType": "3",
        "filterName": "Devoluciones",
        "notificationsNumber": "7"
    },
    {
        "idUser": "71",
        "idFilterType": "4",
        "filterName": "Lotes de pago",
        "notificationsNumber": "626"
    },
    {
        "idUser": "71",
        "idFilterType": "5",
        "filterName": "Ordenes de compra",
        "notificationsNumber": "599"
    },
    {
        "idUser": "71",
        "idFilterType": "8",
        "filterName": "Transferencias Cuentas Bancarias",
        "notificationsNumber": "3"
    },
    {
        "idUser": "71",
        "idFilterType": "11",
        "filterName": "Fondo Fijo",
        "notificationsNumber": "1"
    },
    {
        "idUser": "71",
        "idFilterType": "12",
        "filterName": "Gastos de Viaje",
        "notificationsNumber": "505"
    },
    {
        "idUser": "71",
        "idFilterType": "17",
        "filterName": "Comisiones",
        "notificationsNumber": "301"
    },
    {
        "idUser": "71",
        "idFilterType": "18",
        "filterName": "Nómina",
        "notificationsNumber": "1"
    }
    ];
    */
    const [DATA, setDATA] = useState<NotTypeCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getResumen = async() => {
        const resumenNotifications = notifyAPI.get('/api/notification/GetResumenNotifications',{
            params:{
            idUsuario, 
            fechaIni:'20211201',
            fechaFin: '20220419'}
        });

        const [resumenNotificationsResp] = await Promise.all([resumenNotifications]);

        setIsLoading(false);
        setDATA (resumenNotificationsResp.data);
    }

    useEffect(() => {
        getResumen();
    }, []);

    return ({
        isLoading,
        DATA
    });

}