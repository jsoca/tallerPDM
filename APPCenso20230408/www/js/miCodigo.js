const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const PANTALLA_HOME = document.querySelector("#pantalla-home");
const PANTALLA_PERSONAS = document.querySelector("#pantalla-personas");
const PANTALLA_LOGIN = document.querySelector("#pantalla-login");
const PANTALLA_REGISTRO = document.querySelector("#pantalla-registro");
const PANTALLA_LISTADOPERSONAS = document.querySelector("#pantalla-listadoPersonas");
const PANTALLA_FILTROPOROCUPACION = document.querySelector("#pantalla-filtroporocupacion");
const PANTALLA_TOTALCENSADOS = document.querySelector("#pantalla-totalsensados");
const COMBO_FILTRO_DEPARTAMENTOS = document.querySelector("#pantalla-personas-combo-departamentos");
const COMBO_FILTRO_CIUDADES = document.querySelector("#pantalla-personas-combo-ciudades");
const COMBO_FILTRO_OCUPACIONES = document.querySelector("#pantalla-personas-combo-ocupaciones");

let personas = [];
let departamentos = [];
let ciudades = [];

let apiKeyUsuarioLogueado = '';
let iduserUsuarioLogueado = '';
let departamentoId = '';
let idDepartamentoSeleccionado = null;



let baseURL = 'https://censo.develotion.com';

inicializar();
//  cargarCombos();

function inicializar() {
    actualizarMenu();
    mostrarLogin();
    suscripcionAEventos();
}

function suscripcionAEventos() {
    // Login.
    document.querySelector("#btnLoginIngresar").addEventListener("click", btnLoginIngresarHandler);
    // Registro.
    document.querySelector("#btnRegistroRegistrarse").addEventListener("click", btnRegistroRegistrarseHandler);
    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
    // Personas
    COMBO_FILTRO_DEPARTAMENTOS.addEventListener("ionChange", comboDepartamentosChangeHandler);
    
}

function actualizarMenu() {
    // Oculto todo, luego mostraré sólo lo que corresponde.
    document.querySelector("#btnMenuPersonas").style.display = "none";
    document.querySelector("#btnMenuIngreso").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";
    document.querySelector("#btnMenuListadoPersonas").style.display = "none";
    document.querySelector("#btnMenuFiltroporOcupacion").style.display = "none";
    document.querySelector("#btnMenuTotalCensados").style.display = "none";
    
    if (apiKeyUsuarioLogueado) {
        document.querySelector("#btnMenuPersonas").style.display = "block";
        document.querySelector("#btnMenuCerrarSesion").style.display = "block";
        document.querySelector("#btnMenuListadoPersonas").style.display = "block";
        document.querySelector("#btnMenuFiltroporOcupacion").style.display = "block";
        document.querySelector("#btnMenuTotalCensados").style.display = "block";
    } else {
        document.querySelector("#btnMenuIngreso").style.display = "block";
        document.querySelector("#btnMenuRegistro").style.display = "block";
    }
}

function ocultarPantallas() {
    PANTALLA_REGISTRO.style.display = "none";
    PANTALLA_LOGIN.style.display = "none";
    PANTALLA_HOME.style.display = "none";
    PANTALLA_PERSONAS.style.display = "none";
    PANTALLA_LISTADOPERSONAS.style.display = "none";
    PANTALLA_FILTROPOROCUPACION.style.display = "none";
    PANTALLA_TOTALCENSADOS.style.display = "none";
}

function mostrarLogin() {
    ocultarPantallas();
    PANTALLA_LOGIN.style.display = "block";
}

function mostrarRegistro() {
    ocultarPantallas();
    PANTALLA_REGISTRO.style.display = "block";
}

/*
function mostrardepartamentos() {
    console.log("Mostrando departamentos...");
    ocultarPantallas();
    PANTALLA_PERSONAS.style.display = "block";

    fetch(baseURL + '/departamentos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKeyUsuarioLogueado,
            'iduser': iduserUsuarioLogueado
        }
    })
    .then(response => {
        if (response.status === 409) {
            cerrarSesionPorFaltaDeToken();
        } else {
            return response.json();
        }
    })
    .then(data => {
        console.log("Datos de ciudades obtenidos:", data);
        if (data && data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data && data.length > 0) {
            departamentos = data;
            actualizarComboDepartamentos();
        } else {
            mostrarToast('ERROR', 'Error', 'No se han encontado departamentos');
        }
    })
    .catch(error => console.log(error));
}
*/

// Llamada a la función para cargar el listado de personas 
/*
document.addEventListener('ionViewWillEnter', () => {
    console.log("ionViewWillEnter event fired");
    cargarListadoPersonas();
});
*/

cargarCombos(); /// agregados 

function actualizarComboDepartamentos() {
    console.log("Actualizando combo de departamentos...");
    COMBO_FILTRO_DEPARTAMENTOS.innerHTML = ''; // Limpiamos las opciones existentes
    for (let i = 0; i < departamentos.length; i++) {
      const departamentoActual = departamentos[i];
      const option = document.createElement('ion-select-option');
      option.value = departamentoActual._id;
      // console.log("valor departamento.id linea 128 :", departamentoActual.id);
      option.textContent = departamentoActual.nombre;
      COMBO_FILTRO_DEPARTAMENTOS.appendChild(option);
  
      // Verifico si el departamentoActual._id coincide con el valor actual del combo
      if (departamentoActual._id === COMBO_FILTRO_DEPARTAMENTOS.value) {
        COMBO_FILTRO_DEPARTAMENTOS.value = departamentoActual._id; // Establece el valor seleccionado.
        }
    }
}

        function comboDepartamentosChangeHandler(evt) {
            const nombreDepartamentoSeleccionado = evt.detail.value;
            const departamentoSeleccionado = departamentos.find(depto => depto.nombre === nombreDepartamentoSeleccionado);
        
            if (departamentoSeleccionado) {
                idDepartamentoSeleccionado = departamentoSeleccionado.id; // almaceno el id de departamento
                cargarCiudades(idDepartamentoSeleccionado);
                
               // Obtener la fecha de nacimiento de la persona desde el combo de fecha nacimiento
            const fechaNacimientoInput = document.querySelector('#txtRegistroFechadeNacimiento');
            const fechaNacimiento = new Date(fechaNacimientoInput.value);
            const fechaActual = new Date();
            const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        
                // Actualizar el combo de ocupaciones según la edad
                actualizarComboOcupaciones(edad);
            } else {
                console.log("Departamento no encontrado en la lista de departamentos:", nombreDepartamentoSeleccionado);
            }
            
            // Limpia el combo de ciudades antes de cargar nuevas opciones.
            COMBO_FILTRO_CIUDADES.innerHTML = '';
        }
        
        function comboDepartamentosChangeHandler(evt) {
            const nombreDepartamentoSeleccionado = evt.detail.value;
            const departamentoSeleccionado = departamentos.find(depto => depto.nombre === nombreDepartamentoSeleccionado);
        
            if (departamentoSeleccionado) {
                idDepartamentoSeleccionado = departamentoSeleccionado.id;
                cargarCiudades(idDepartamentoSeleccionado);
        
                // Obtener la fecha de nacimiento de la persona desde el combo de fecha nacimiento
                const fechaNacimientoInput = document.querySelector("#txtRegistroFechadeNacimiento");
                const fechaNacimiento = new Date(fechaNacimientoInput.value);
                const fechaActual = new Date();
                const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        
                // Actualizar el combo de ocupaciones según la edad
                actualizarComboOcupaciones(edad);
            } else {
                console.log("Departamento no encontrado en la lista de departamentos:", nombreDepartamentoSeleccionado);
            }
        
            // Limpia el combo de ciudades antes de cargar nuevas opciones.
            COMBO_FILTRO_CIUDADES.innerHTML = '';
        }
        
        function actualizarComboOcupaciones(edad) {
            const comboOcupaciones = document.querySelector("#pantalla-departamentos-combo-ocupaciones");
            comboOcupaciones.innerHTML = ''; // Limpiar las opciones existentes
        
            if (edad < 18) {
                // Si la persona tiene menos de 18 años, mostrar solo la opción de "Estudiante"
                const optionEstudiante = document.createElement('ion-select-option');
                optionEstudiante.value = 5;  // id 5 = Estudiante
                optionEstudiante.textContent = 'Estudiante';
                comboOcupaciones.appendChild(optionEstudiante);
            } else {
                // Si la persona tiene 18 años o más, cargar las ocupaciones desde la API
                try {
                    fetch(`${baseURL}/ocupaciones.php`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'apiKey': apiKeyUsuarioLogueado,
                            'iduser': iduserUsuarioLogueado
                        }
                    })
                    .then(response => {
                        if (response.status === 409) {
                            cerrarSesionPorFaltaDeToken();
                        } else {
                            return response.json();
                        }
                    })
                    .then(data => {
                        if (data && data.ocupaciones) {
                            data.ocupaciones.forEach(ocupacion => {
                                const option = document.createElement('ion-select-option');
                                option.value = ocupacion.id;
                                option.textContent = ocupacion.ocupacion;
                                comboOcupaciones.appendChild(option);
                            });
                        } else {
                            mostrarToast('ERROR', 'Error', 'No se encontraron ocupaciones');
                        }
                    })
                    .catch(error => {
                        mostrarToast('ERROR', 'Error', 'Error al cargar ocupaciones');
                        console.log(error);
                    });
                } catch (error) {
                    mostrarToast('ERROR', 'Error', 'Error al cargar ocupaciones');
                    console.log(error);
                }
            }
        }
  
function obtenerDepartamentoPorId(id) {
    let dpto = null;
    let i = 0;
    while (!dpto && i < departamentos.length) {
        const departamentoActual = departamentos[i];
        if (departamentoActual._id === id) {
            dpto = departamentoActual;
        }
        i++;
    }
    return dpto;
}
/*
function mostrarProductos() {
    ocultarPantallas();
    // completarPantallaProductos(); 
    PANTALLA_PRODUCTOS.style.display = "block";
}

/*
function completarPantallaProductos() {
    productos = [];

    fetch(baseURL + '/productos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': tokenUsuarioLogueado
        }
    }).then((response) => {
        if (response.status === 401) {
            cerrarSesionPorFaltaDeToken();
        } else {
            return response.json();
        }
    }).then((data) => {
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.data) {
            productos = data.data;
            completarTablaProductos();
        } else {
            mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
        }
    }).catch(error => console.log(error));
}

function completarTablaProductos() {
    let listadoProductos = '';

    productos.forEach((p) => {
        let listadoEtiquetas = '';
        p.etiquetas.forEach((e, i) => {
            listadoEtiquetas += `<span>${e}</span>`;
            if (i !== p.etiquetas.length -1 ) {
                listadoEtiquetas += " | "
            }
        });

        listadoProductos += `
            <div>
                <img width="150" src="https://ort-tallermoviles.herokuapp.com/assets/imgs/${p.urlImagen}.jpg">
                <br>
                <h2>${p.nombre}</h2>
                <h3>(${p.codigo})</h3>
                <h3>$${p.precio}</h3>
                <h4>${listadoEtiquetas}</h4>
                <h4>${p.estado}</h4>
                <hr>
            </div>
        `;
    });

    if (listadoProductos === '') {
        listadoProductos = "No se encontraron productos.";
    }

    document.querySelector("#divProductos").innerHTML = listadoProductos;
}
*/
function verificarInicio() {
    if (apiKeyUsuarioLogueado) {
        NAV.setRoot("page-personas");
        NAV.popToRoot();
    } else {
        NAV.setRoot("page-login"); 
        NAV.popToRoot();
    }
}

function cerrarMenu() {
  MENU.close();
}

function navegar(evt) {
    apiKeyUsuarioLogueado = localStorage.getItem("APPProductosToken");
    actualizarMenu();

    const ruta = evt.detail.to;
    if (ruta == "/") {
        verificarInicio();
    } else if (ruta == "/login") {
        mostrarLogin();
    } else if (ruta == "/personas") {
        // Verificar si el usuario está logueado antes de mostrar la pantalla personas
        if (apiKeyUsuarioLogueado) {
            cargarDepartamentos();
        } else {
            // Si el usuario no está logueado, redirigir a la pantalla de inicio de sesión
            mostrarLogin();
        }
    } else if (ruta == "/registro") {
        mostrarRegistro();
    } else if (ruta == "/listadoPersonas") {
       mostrarListadoPersonas(); 
    //} else if (ruta == "/filtroporOcupacion") {
        //mostrarfiltroporOcupacion();
    //} else if (ruta == "/totalCensados") {
        //mostrarTotalCensados();
    }
}

/*
document.addEventListener('ionViewWillEnter', () => {
    cargarListadoPersonas();

    // Obtener el elemento del listado de personas
    const listaPersonasElement = document.getElementById('listaPersonas');

    // Desplazar la página al elemento del listado de personas
    if (listaPersonasElement) {
        listaPersonasElement.scrollIntoView({ behavior: 'smooth' });
    }
});

*/

function cerrarSesion () {
    cerrarMenu();
    localStorage.clear();
    apiKeyUsuarioLogueado = '';
    actualizarMenu();
    NAV.setRoot("page-login");
    NAV.popToRoot();
}

//// Login //////
function btnLoginIngresarHandler () {
    const usuarioIngresado = document.querySelector("#txtLoginUsuario").value;
    const passwordIngresado = document.querySelector("#txtLoginPassword").value;

    // Verifico que el usuario haya escrito algo en los campos de usuario y password.
    if (usuarioIngresado.trim().length > 0 && passwordIngresado.trim().length > 0) {
        let datos = {
            usuario: usuarioIngresado,
            password: passwordIngresado
        };
        
        fetch(baseURL + '/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            } else if (data.apiKey) {
                apiKeyUsuarioLogueado = data.apiKey;
                iduserUsuarioLogueado = data.id;

                console.log(data.apiKey);
                console.log(data.id);

                localStorage.setItem('APPProductosToken', apiKeyUsuarioLogueado);
                actualizarMenu();
                NAV.setRoot("page-personas");
                NAV.popToRoot();
            } else {
                mostrarToast('ERROR', 'Error', 'La respuesta de la API no contiene apiKey válida.');
            }

            
        })
        .catch(error => console.log(error));
    } else {
        mostrarToast('ERROR', 'Datos incompletos', 'Debe ingresar emial y contraseña');
    }
}

///// Registro /////
function btnRegistroRegistrarseHandler() {
    const usuarioIngresado = document.querySelector("#txtRegistroUsuario").value;
    const passwordIngresado = document.querySelector("#txtRegistroPassword").value;
    const verificacionPasswordIngresada = document.querySelector("#txtRegistroVerificacionPassword").value;

    // Verifico que el usuario haya escrito algo en todos los campos.
    if (
        usuarioIngresado.trim().length > 0 &&
        passwordIngresado.trim().length > 0 &&
        verificacionPasswordIngresada.trim().length > 0
    ) {
        // Verifico que la contraseña y la verificación coincidan
        if (passwordIngresado === verificacionPasswordIngresada) {
            let datos = {
                usuario: usuarioIngresado,
                password: passwordIngresado
            };

            fetch(baseURL + '/usuarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (response.status === 200) {
                    vaciarCamposRegistro();
                    mostrarToast('SUCCESS', 'Registro exitoso', 'Ya puede iniciar sesión');
                    NAV.push("page-login");
                } else if (response.status === 409) {
                    return response.json(); // Manejar el caso de usuario ya registrado
                } else {
                    throw new Error('Error desconocido'); // Manejar otros códigos de respuesta
                }
            })
            .then(data => {
                if (data && data.mensaje) {
                    
                    mostrarToast('ERROR', 'Error', data.mensaje);
                }
            })
            .catch(error => {
                mostrarToast('ERROR', 'Error', error.message);
            });

        } else {
            mostrarToast('ERROR', 'Error', 'La contraseña y la verificación de contraseña deben ser iguales');
        }
    } else {
        mostrarToast('ERROR', 'Datos incompletos', 'Todos los campos son obligatorios');
    }
}
//////////////////////////// Cargar Departamentos
// Esta función carga los departamentos desde la API y los agrega al combo desplegable.
function cargarDepartamentos() {
    ocultarPantallas();
    PANTALLA_PERSONAS.style.display = "block";

    fetch(baseURL + '/departamentos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKeyUsuarioLogueado,
            'iduser': iduserUsuarioLogueado 
        }
    })
    .then(response => {
        if(response.status == 401){
            cerrarSesionPorFaltaDeToken();
        } else {
            return response.json();
        }    
    }).then(data => {
        if (data && data.error) {
            mostrarToast('ERROR', 'Error', data.mensaje);
        } else if (data && data.departamentos.length > 0) {
            departamentos = data.departamentos;
            console.log("Departamentos cargados:", departamentos); // Agregamos este console.log
            actualizarComboDepartamentos();
        } else {
           // mostrarToast('ERROR', 'Error', 'No se han encontrado Departamentos');
        }
    })
    .catch(error => console.error('Error al cargar departamentos:', error));
}

///////////////////////  Fin cargar Departamentos 

//////// Cargar Ciudades /////

// Función para cargar las ciudades de un departamento
function cargarCiudades(departamentoId) {
    console.log ("departamentoId linea 471 ",departamentoId);

    // Limpia el combo de ciudades antes de cargar nuevas ciudades.
    COMBO_FILTRO_CIUDADES.innerHTML = '';

    // Realiza la llamada GET a la API para obtener las ciudades del departamento.
    fetch(`${baseURL}/ciudades.php?idDepartamento=${departamentoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKeyUsuarioLogueado,
            'iduser': iduserUsuarioLogueado
        }
    })
    .then(response => {
        if (response.status === 409) {
            cerrarSesionPorFaltaDeToken();
        } else {
            return response.json();
        }
    })
    .then(data => {
       // console.log("Datos de ciudades obtenidos:", data);
        if (data && data.ciudades) {
            // Itera sobre las ciudades y agrega opciones al combo de ciudades.
            data.ciudades.forEach(ciudad => {
                const option = document.createElement('ion-select-option');
                option.value = ciudad.id;
                option.textContent = ciudad.nombre;
                COMBO_FILTRO_CIUDADES.appendChild(option);
            });
        } else {
            //mostrarToast('ERROR', 'Error', 'No se encontraron ciudades para ese departamento');
        }
    })
    .catch(error => {
        mostrarToast('ERROR', 'Error', 'Error al cargar ciudades');
        console.log(error);
    });
}

////// Fin cargar ciudades ////////

// Esta función se llama cuando se hace clic en el botón "Guardar".
function guardarPersona() {
  const nombre = document.getElementById('txtNombre').value;
  const departamentoId = document.getElementById('cmbDepartamento').value;

  console.log('Nombre:', nombre);
  console.log('Departamento ID:', departamentoId);

  
}

// Esta función se ejecutará cuando la página termine de cargar.
//window.onload = function () {
 // cargarDepartamentos();
//};

//////// Cargar Ocupaciones  //////////
    async function cargarOcupaciones() {
    COMBO_FILTRO_OCUPACIONES.innerHTML = '';

    try {
        // si es menor de 18 solo ocupación estudiante
        const ocupacionesData = [
            { id: 1, nombre: 'Estudiante' },
        ];

            ocupacionesData.forEach(ocupacion => {
            const option = document.createElement('ion-select-option');
            option.value = ocupacion.id;
            option.textContent = ocupacion.nombre;
            COMBO_FILTRO_OCUPACIONES.appendChild(option);
        });
    } catch (error) {
        mostrarToast('ERROR', 'Error', 'Error al cargar ocupaciones');
        console.log(error);
    }
}

//////// Fin Cargar Ocupaciones  /////

//// registrar persona censada  /////

const BTN_REGISTRO_PERSONA = document.querySelector("#btnRegistroPersona");

BTN_REGISTRO_PERSONA.addEventListener("click", () => {
    const nombre = document.querySelector("#txtRegistroNombre").value;
    //const idDepartamentoSeleccionado = document.querySelector("#pantalla-personas-combo-departamentos").value;
    const idCiudad = document.querySelector("#pantalla-personas-combo-ciudades").value;
    const fechaNacimiento = document.querySelector("#txtRegistroFechadeNacimiento").value;
    const idOcupacion = document.querySelector("#pantalla-departamentos-combo-ocupaciones").value;
    // Verificar si algún campo está vacío
    if (!nombre || !idDepartamentoSeleccionado || !idCiudad || !fechaNacimiento || !idOcupacion) {
        mostrarToast('ERROR', 'Error', 'Por favor, complete todos los campos.');
        return; // Detener el proceso si algún campo está vacío
    }
    // Crear el objeto de datos a enviar a la API
    const datosPersona = {
        idUsuario: iduserUsuarioLogueado, // ID del usuario logueado
        nombre: nombre,
        departamento: idDepartamentoSeleccionado, // Usar el ID del departamento seleccionado
        ciudad: idCiudad,
        fechaNacimiento: fechaNacimiento,
        ocupacion: idOcupacion
    };

    // Realizar el envío de datos a la API
    try {
        fetch(`${baseURL}/personas.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKeyUsuarioLogueado,
                'iduser': iduserUsuarioLogueado
            },
            body: JSON.stringify(datosPersona)
        })
        .then(response => {
            if (response.status === 409) {
                cerrarSesionPorFaltaDeToken();
            } else {
                return response.json();
            }
        })

        .then(data => {
            if (data && data.codigo === 200) {
                // La persona fue censada exitosamente
                mostrarToast('ÉXITO', 'Éxito', 'Persona censada con éxito');
            // Limpiar la pantalla para ingresar una nueva persona
            limpiarPantallaAltaPersona();
            cargarCombos();
            } else {
                mostrarToast('ERROR', 'Error', 'Error al censar persona');
            }
        })
        .catch(error => {
            mostrarToast('ERROR', 'Error', 'Error al censar persona');
            console.log(error);
        });
    } catch (error) {
        mostrarToast('ERROR', 'Error', 'Error al censar persona');
        console.log(error);
    }
});
//// fin registrar persona censada 

//// vacio campos para registrar a la siguiente persona censada

function vaciarCamposRegistro() {
    document.querySelector("#txtRegistroUsuario").value = '';
    document.querySelector("#txtRegistroPassword").value = '';
    document.querySelector("#txtRegistroVerificacionPassword").value = '';
}

async function mostrarToast(tipo, titulo, mensaje) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = mensaje;
    toast.position = 'bottom';
    toast.duration = 2000;
    if (tipo === "ERROR") {
        toast.color = "danger";
    } else if (tipo === "SUCCESS") {
        toast.color = "success";
    } else if (tipo === "WARNING") {
        toast.color = "warning";
    }

    document.body.appendChild(toast);
    return toast.present();
}

function cerrarSesionPorFaltaDeToken() {
    mostrarToast('ERROR', 'No autorizado', 'Se ha cerrado sesión por seguridad');
    cerrarSesion();
}


// Función para limpiar los campos de login
function limpiarCamposLogin() {
    document.querySelector("#txtUsuario").value = "";
    document.querySelector("#txtPassword").value = "";
  }
  
  // Evento que se ejecuta antes de salir de la página
  window.addEventListener("beforeunload", function () {
    limpiarCamposLogin();
  });


  function limpiarPantallaAltaPersona() {
    // Limpiar campos de entrada
    document.querySelector("#txtRegistroNombre").value = '';
    document.querySelector("#txtRegistroFechadeNacimiento").value = '';

    // Reiniciar combos
    const comboDepartamentos = document.querySelector("#pantalla-personas-combo-departamentos");
    comboDepartamentos.value = null;
    comboDepartamentos.innerHTML = '';

    const comboCiudades = document.querySelector("#pantalla-personas-combo-ciudades");
    comboCiudades.value = null;
    comboCiudades.innerHTML = '';

    const comboOcupaciones = document.querySelector("#pantalla-departamentos-combo-ocupaciones");
    comboOcupaciones.value = null;
    comboOcupaciones.innerHTML = '';
}


function cargarCombos() {
    cargarDepartamentos();
    cargarCiudades(); 
    cargarOcupaciones(); 
}

////// funcion para cargar personas censadas por el usuario logueado //////
/////// nueva funcion 
// Función para mostrar el listado de personas
function mostrarListadoPersonas() {
    ocultarPantallas();
    PANTALLA_LISTADOPERSONAS.style.display = "block";

    // Obtener la referencia al elemento donde se mostrarán los datos
    const listaPersonas = document.querySelector("#pantalla-listadoPersonas ion-content");

    // Realizar la llamada a la API para obtener el listado de personas
    fetch(`${baseURL}/personas.php?idUsuario=${iduserUsuarioLogueado}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKeyUsuarioLogueado,
            'iduser': iduserUsuarioLogueado
        }
    })
    .then(response => {
        if (response.status === 409) {
            cerrarSesionPorFaltaDeToken();
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.personas) {
            // Limpiar el contenido existente
            listaPersonas.innerHTML = "";
    
            // Iterar sobre las personas y crear elementos para mostrar los datos
            data.personas.forEach(persona => {
                // Crear un ion-card para cada persona
                const personaCard = document.createElement("ion-card");
                personaCard.className = "persona-card";
    
                // Crear el contenido de la tarjeta con ion-card-content
                const cardContent = document.createElement("ion-card-content");
                cardContent.innerHTML = `
                <ion-card-title>${persona.nombre}</ion-card-title>
                <ion-card-subtitle>Fecha de Nacimiento: ${persona.fechaNacimiento}</ion-card-subtitle>
                <ion-card-subtitle>Ocupación: ${persona.ocupacion}</ion-card-subtitle>
                <br>
                <ion-button color="danger" expand="full" class="eliminar-button" data-id="${persona.id}">Eliminar</ion-button>
                <br>
                <br>
                `;
    
                // Agregar el contenido a la tarjeta
                personaCard.appendChild(cardContent);
    
                // Agregar la tarjeta a la lista de personas
                listaPersonas.appendChild(personaCard);
            });
        }
    })
    .catch(error => {
        console.log(error);
        // Mostrar un mensaje de error si ocurre algún problema con la llamada a la API
        listaPersonas.innerHTML = "<ion-label>Error al cargar el listado de personas.</ion-label>";
    });
}

/////////  Escuchar el evento de clic en los botones de  eliminar persona censada //////

document.addEventListener("click", event => {
    if (event.target.classList.contains("eliminar-button")) {
        const idPersona = event.target.getAttribute("data-id");
        if (idPersona) {
            // Realizar la solicitud DELETE a la API
            fetch(`https://censo.develotion.com/personas.php?idCenso=${idPersona}`, {
                method: "DELETE",
                headers: {
                    'apiKey': apiKeyUsuarioLogueado,
                    'iduser': iduserUsuarioLogueado
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.codigo === 200) {
                    // Eliminación exitosa, actualizar la lista de personas
                    const personaCard = event.target.closest(".persona-card");
                    personaCard.remove(); // Eliminar la tarjeta de persona
            
                    // Mostrar el ion-toast de confirmación
                    const toastConfirmacion = document.getElementById("toast-confirmacion");
                    toastConfirmacion.present();
                } else {
                    console.log("Error al eliminar el registro. Mensaje:", data.mensaje);
                }
            })
            .catch(error => {
                //console.log("Error en la solicitud DELETE:", error);
            });
        }
    }
});

//////// Filtro por tipo de ocupación //////////////////////
// Obtener la lista de ocupaciones
fetch("https://censo.develotion.com/ocupaciones.php", {
  method: "GET",
  headers: {
    'apiKey': apiKeyUsuarioLogueado,
    'iduser': iduserUsuarioLogueado
  }
})
  .then(response => response.json())
  .then(data => {
    const ocupaciones = data.ocupaciones;
    // Crear opciones para el filtro de ocupaciones
    const filtroOcupaciones = document.getElementById("filtro-ocupaciones");
    ocupaciones.forEach(ocupacion => {
      const opcion = document.createElement("option");
      opcion.value = ocupacion.id;
      opcion.textContent = ocupacion.ocupacion;
      filtroOcupaciones.appendChild(opcion);
    });
  })
  .catch(error => console.error("Error al obtener las ocupaciones:", error));

// Agregar evento de escucha al filtro de ocupaciones
const filtroOcupaciones = document.getElementById("filtro-ocupaciones");
filtroOcupaciones.addEventListener("change", () => {
  const ocupacionSeleccionada = filtroOcupaciones.value;
  // Filtrar y mostrar las personas según la ocupación seleccionada
  // ...
});

//////// Fin Filtro por tipo de ocupación ////////////////







  
 

  