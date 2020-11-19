import { servidorPost } from '../js/request'


const back =async (data) => {
    const result = await servidorPost('/backend/', data)

    return result;
}


export const notificacion=(data)=> {
    
    const ruta = data.ruta;
    data.opcion = 1;


   

    if (ruta===0) {

        //alert(ruta);
        var info = {
            id_consulta: "insertar_asignacion",
            id_expediente: data.id_expediente,
            id_tarea: 3,
            usuario_responsable: data.usuario_responsable
        };
        var info1 = {
            id_consulta: "insertar_asignacion",
            id_expediente: data.id_expediente,
            id_tarea: 4,
            usuario_responsable: data.usuario_responsable
        };
        var info2 = {
            id_consulta: "insertar_asignacion",
            id_expediente: data.id_expediente,
            id_tarea: 5,
            usuario_responsable: data.usuario_responsable
        };
        var info3 = {
            id_consulta: "insertar_asignacion_tecnico",
            id_expediente: data.id_expediente,
            id_tarea: 2,
            usuario_responsable: data.usuario_responsable
        };

        (async () => {
            await back(info);
            await back(info1);
            await back(info2);
            await back(info3);


            var not1 = {
                id_consulta: "insertar_notificacion",
                tarea_next: 2,
                ruta_destino: 1,
                id_expediente:data.id_expediente
            };

            var not2 = {
                id_consulta: "insertar_notificacion",
                tarea_next: 3,
                ruta_destino: 2,
                id_expediente:data.id_expediente
            };
        
    
            (async () => {
                await back(not2)

                await back(not1)           
    
            })()



        })()

       
            
    }
    else if (ruta===1 || ruta==7) {//el tecnico se desprende de su tarea
        data.id_consulta = "tarea_intermedio";
        
        (async () => {
            var result = await back(data)
            if (result.data == 2) {
                
                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 5;
                data.ruta_destino = 3;

                await back(data)

            }
            
        })()

    }
    else if (ruta===2 || ruta==5 || ruta==8) {//el juridico se desprende de su tarea
        
        data.id_consulta = "insertar_notificacion";
        data.tarea_next = 4;
        data.ruta_destino = 4;
        
        (async () => {
            await back(data)
            
        })()

    }
        
    else if (ruta===4 ) {//el sup. juridico se desprende de su tarea
        
        data.id_consulta = "aprobado_juridico";

        (async () => {
            var result = await back(data);

            console.log(result);

            if (result.data[0].aprobado) {//se encuentra aprobado el estudio juridico
                
                //alert("aprobado");
                
                (async () => {

                    //alert()

                    var post = {
                        id_consulta: "tarea_intermedio",
                        id_expediente: data.id_expediente
                    }

                    var resultado = await back(post)

                    console.log(resultado)

                    if (resultado.data[0].control === 2) {
                        
                        //alert("enviando tarea sup. tecnico");

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 5,
                            ruta_destino: 6,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }

        
                        await back(post2)
        
                    }
                    
                })()

                

            } else {

                //alert("no aprobado")
                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 3;
                data.ruta_destino = 5;

                await back(data)
            }
            
        })()

    } 
    
    else if (ruta == 6) {// tarea a cargo del sup tecnico
        

        data.id_consulta = "aprobado_tecnico";

        (async () => {
            var result = await back(data);

            console.log(result);

            if (!result.data[0].aprobado) {// NO se encuentra aprobado el estudio tecnico
                
                //alert("NO aprobado");
                
                (async () => {

                    //alert()

                    var post = {
                        id_consulta: "regresar_tecnico",
                        id_expediente: data.id_expediente
                    }

                    var resultado = await back(post)

                    console.log(resultado)

                    if (resultado.data[0].regresar === 1) {
                        
                        //alert("enviando tarea al tecnico");

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 2,
                            ruta_destino: 7,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }
                        await back(post2)

                        var upd_inter={id_consulta:'update_intermedio',control:1}
                        await back(upd_inter)
                    }
                    else if (resultado.data[0].regresar === 2) {
                        
                        //alert("enviando tarea al juridico");

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 3,
                            ruta_destino: 8,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }
                        await back(post2)

                        var upd_inter={id_consulta:'update_intermedio',control:1}
                        await back(upd_inter)
                    }
                    else if (resultado.data[0].regresar === 3) {
                        
                        //alert("enviando tarea al tecnico y juridico");

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 2,
                            ruta_destino: 7,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }
                        await back(post2)

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 3,
                            ruta_destino: 8,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }
                        await back(post2)

                        var upd_inter={id_consulta:'update_intermedio',control:0}
                        await back(upd_inter)
        
                    } else {
                        //alert("enviando tarea al tecnico por default");

                        var post2 = {
                            id_consulta: "insertar_notificacion",
                            tarea_next: 2,
                            ruta_destino: 7,
                            opcion: 1,
                            id_expediente:data.id_expediente
                        }
                        await back(post2)

                        var upd_inter={id_consulta:'update_intermedio',control:1}
                        await back(upd_inter)

                    }


                    
                })()

                

            } else {
                
                //alert("se acabo todo el flujo de momento...");

                data.id_consulta = "insertar_notificacion"
                data.tarea_next = 6;
                data.ruta_destino = 9;

                await back(data)
                
            }
            
        })()


    }
        
        
    else if (ruta === -1) {//esta es la forma de quitarme una tarea actualizando su estado
        
        data.id_consulta = "update_tareas_estado";

        (async () => {
            await back(data)
            
        })()

    }
        

}
