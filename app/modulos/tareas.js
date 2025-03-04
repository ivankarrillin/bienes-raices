import React from 'react';
import ReactDOM from 'react-dom';
const servidor = require('../js/request.js');

var moment = require('moment');

import { Link } from 'react-router-dom';

import { Modal } from './popup_tarea'

import SearchIcon from '@material-ui/icons/Search';
moment.locale('es');


const Tarea = ({refresh_number}) => {

    const [data, setData] = React.useState([]);
    const [filtro, setFiltro] = React.useState([]);

    const [refresh, setRefresh] = React.useState(false);

    React.useEffect( () => {

    async function getTareas() {
        var datos = { "id_consulta": "get_tareas" }
        const result = await servidor.servidorPost('/backend', datos);
        
        console.log(result)
            
        setData(result.data);
        setFiltro(result.data)
    }

 
    getTareas();

    refresh_number(Math.random())
        
        
    }, [refresh]);
    

    const change = e=> {
        console.log(e.target.value)

        console.log(data)
        const input = e.target.value;

        var result = data.filter(info => info.id_expediente.toUpperCase().includes(input.toUpperCase()))

        

        setFiltro(result);

    }

    const color = (fecha) => {
        
        const f_noti = moment.utc(fecha);
        
        const f_15 = moment().subtract(15, 'days');

        var msg = "";

        if (f_noti > f_15) {
            msg="success"
         } else {
            const f_30 = moment().subtract(30, 'days');
            if (f_noti > f_30) {
                msg="warning"
            } else {
                msg="danger"
            }
         }



        return msg;
    }

    
    return (
        <div id="listado">

            <div id="listado-header">
            <h3>Listado de tareas en el sistema</h3>

            <p>Puede filtrar el listado de tareas por id expediente en el siguiente cuadro</p>

            <div>
            <input onChange={change} className="form-input" placeholder="Filtrar..."></input>
            </div>
            </div>

            <div className="leyenda">
                <span className="bolita success"></span>
                <p> menos de 15 días</p>
                <span className="bolita warning"></span>
                <p> entre 15 y 30 días</p>
                <span className="bolita danger"></span>
                <p> más de 30 días</p>
            </div>
           

            
            {filtro.map((item, index) =>
                <div className={"grupo "+color(item.fecha_asignacion) }>
                    <p className="titulo">{item.id_expediente}</p>
                    <p>Fecha Asignación: {moment.utc(item.fecha_asignacion).format("dddd, MMMM D YYYY, h:mm:ss a")}</p>
                    <p>Enviado por: {item.usuario_nombre}</p>
                    <p>Descripción: {item.descripcion}</p>
                    <button >
                        <Link to={"/predio/" + item.id_expediente}> 
                            Ver expediente
                        </Link>
                    </button>

                    <Modal
                        nombre={item.id_expediente}
                        id={item.id}
                        refresh={setRefresh}
                        tareacod={item.ruta}
                    />
                </div>
            )}
            {filtro.length==0?<p>Sin resultados</p>:''}
            
        </div>
    );
  
}
  
export { Tarea }