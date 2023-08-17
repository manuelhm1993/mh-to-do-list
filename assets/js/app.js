// ------------------- Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

// ------------------- Colección de tareas
let tareas = {};

// ------------------- Funciones globales
//
// ------------------- Formatear a capitalize la tarea
const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.toLowerCase().substring(1)}`;

// ------------------- Limpia las clases de validación en el input
const formatearTarea = (tarea, formulario = null) => {

    if(!formulario) {
        tarea.classList.remove('is-invalid', 'is-valid');
        return;
    }

    // ------------------- Forma de iterar un formulario sin FormData
    [...formulario].forEach(input => {
        if(input.tagName !== 'BUTTON') {
            input.classList.remove('is-invalid', 'is-valid');
        }
    });
};

// ------------------- Obtener el array tareas del localStorage
const getTareasLocalStorage = () => {
    if(localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
        leerTareas();
    }
};

// ------------------- Establecer el array tareas en el localStorage
const setTareasLocalStorage = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
};

// ------------------- Funciones CRUD
// 
// ------------------- Crear una nueva tarea en el objeto tareas
const crearTarea = (tarea) => {
    const nuevaTarea = {
        // ------------------- Devolver un número aleatorio entre 0-1 convertirlo a alfanumérico y elimnar la parte entera y el .
        // ------------------- Devolver el milisegundo de creación y unir ambas cosas en una cadena para un uuid único
        id: Math.random().toString(36).substring(2) + Date.now(),
        title: capitalize(tarea['titulo-tarea'].value.trim()),
        body: tarea['tarea'].value.trim(),
        status: false
    };

    // ------------------- Crear la nueva tarea en la lista
    tareas[nuevaTarea.id] = { ...nuevaTarea };

    leerTareas();
};

// ------------------- Renderizar el listado de tareas
const leerTareas = () => {
    listaTareas.textContent = '';

    Object.values(tareas).forEach((tarea) => {
        const clonListaTareasTemplate = listaTareasTemplate.cloneNode(true);

        clonListaTareasTemplate.querySelector('.alert h5').textContent = tareas[tarea.id].title;

        const pTitle = clonListaTareasTemplate.querySelector('.alert p');

        pTitle.textContent = tareas[tarea.id].body;
        pTitle.dataset.idTarea = tareas[tarea.id].id;

        // ------------------- Recorrer los botones de acción y asignarles el dataset con el id de la tarea
        clonListaTareasTemplate.querySelectorAll('.alert h3 i').forEach((tagI) => {
            // ------------------- Comprobar si la tarea está terminada
            if((tareas[tarea.id].status)) {
                // ------------------- Asignar las clases correspondientes al status
                pTitle.classList.toggle('text-decoration-line-through');

                if(tagI.matches('.fa-square-check') || tagI.matches('.fa-square')) {
                    tagI.classList.toggle('d-none');
                }
            }

            tagI.dataset.idTarea = tareas[tarea.id].id;
        });

        fragmentlistaTareasTemplate.appendChild(clonListaTareasTemplate);
    });

    listaTareas.appendChild(fragmentlistaTareasTemplate);

    setTareasLocalStorage();
};

// ------------------- Modifica el estado de la tarea del id especificado
const modificarStatusTarea = (botonAccion) => {
    // ------------------- Modificar el status de la tarea a terminado o no terminado
    tareas[botonAccion.dataset.idTarea].status = !tareas[botonAccion.dataset.idTarea].status;

    // ------------------- Comprobar que botón de acción es, para mostrarlo u ocultarlo
    if(botonAccion.classList.contains('fa-square')) {
        botonAccion.classList.toggle('d-none');
        botonAccion.previousElementSibling.classList.toggle('d-none');
    }
    else if(botonAccion.classList.contains('fa-square-check')) {
        botonAccion.classList.toggle('d-none');
        botonAccion.nextElementSibling.classList.toggle('d-none');
    }

    // ------------------- Tachar o destachar la tarea dependiendo del botón de acción
    const cuerpoTarea = listaTareas.querySelector(`p[data-id-tarea="${botonAccion.dataset.idTarea}"]`);

    cuerpoTarea.classList.toggle('text-decoration-line-through');

    setTareasLocalStorage();
};

// ------------------- Acceder a la tarea para realizar su actualización
const modificarTarea = (idTarea) => {
    if(tareas[idTarea].status) {
        formulario.querySelector('#titulo-tarea').value = tareas[idTarea].title;
        formulario.querySelector('#tarea').value = tareas[idTarea].body;

        const botonAccion = formulario.querySelector('#agregar-tarea');

        botonAccion.textContent = 'Modificar';
        botonAccion.dataset.idTarea = idTarea;
        
        formatearTarea(null, formulario);
    }
};

// ------------------- Actualiza la tarea con los parámetros dados
const actualizarTarea = (botonAccion) => {
    // ------------------- Actualizar la tarea
    const tituloTarea = formulario.querySelector('#titulo-tarea');
    const tarea = formulario.querySelector('#tarea');

    tareas[botonAccion.dataset.idTarea].status = false;
    tareas[botonAccion.dataset.idTarea].title = tituloTarea.value;
    tareas[botonAccion.dataset.idTarea].body = tarea.value;

    // ------------------- Iterar los botones de acción alert
    listaTareas.querySelectorAll(`i[data-id-tarea="${botonAccion.dataset.idTarea}"]`).forEach((boton) => {
        // ------------------- Cambiar el estado de los botones
        if(boton.classList.contains('fa-square-check') || boton.classList.contains('fa-square')) {
            boton.classList.toggle('d-none');
        }
    });

    // ------------------- Resetear el formulario a su estado base
    formulario.reset();
    botonAccion.textContent = 'Agregar';
    botonAccion.removeAttribute('data-id-tarea');

    leerTareas();
    formatearTarea(null, formulario);
    tituloTarea.focus();
};

// ------------------- Elimina la tarea del id especificado
const eliminarTarea = (idTarea) => {
    delete tareas[idTarea];
    
    leerTareas();

    formulario.firstElementChild.focus();

    const botonAccion = formulario.querySelector('#agregar-tarea');

    // ------------------- Validar que no se esté modificando
    if(botonAccion.hasAttribute('data-id-tarea')) {
        botonAccion.textContent = 'Agregar';
        botonAccion.removeAttribute('data-id-tarea');
        formulario.reset();
    }

    // --------------- Si no hay tareas en la lista, eliminar el localStorage
    if(Object.values(tareas).length === 0) {
        localStorage.removeItem("tareas");
    }
};

// ------------------- Funciones de validación
//
// ------------------- Al hacer submit
const validarSubmit = (fuenteEvento, id) => {
    let valido = true;

    if(fuenteEvento[id].value.trim().length === 0) {
        fuenteEvento[id].classList.add('is-invalid');
        valido = false;
    }

    return valido;
};

// ------------------- Al soltar la tecla (backspace solo funciona con keyup)
const validarKeyUp = (fuenteEvento, codigoTecla) => {
    // ------------------- Si el input tiene valor y no es un espacio en blanco es válido
    if((fuenteEvento.value.trim().length > 0) 
    && (fuenteEvento.classList.contains('is-invalid'))) {
        fuenteEvento.classList.remove('is-invalid');
        fuenteEvento.classList.add('is-valid');
    }

    // ------------------- Si al borrar el campo queda vacío, es inválido
    if((codigoTecla === 'Backspace') 
    && (fuenteEvento.value.trim().length === 0) 
    && (fuenteEvento.classList.contains('is-valid'))) {
        fuenteEvento.classList.remove('is-valid');
        fuenteEvento.classList.add('is-invalid');
    }
};

// ------------------- Al cambiar
const validarChange = (fuenteEvento) => {
    // ------------------- Si el input tiene valor y no es un espacio en blando, es válido
    if(fuenteEvento.value.trim().length > 0) {
        fuenteEvento.classList.remove('is-invalid');
        fuenteEvento.classList.add('is-valid');
    }
    // ------------------- Si el input tiene está vacío, se resetea el formulario y se coloca el input inválido
    else {
        fuenteEvento.classList.add('is-invalid');
        fuenteEvento.classList.remove('is-valid');
        formulario.value = '';
    }
};

// ------------------- Funciones de eventos
// 
// ------------------- Al hacer submit
const submit = (e) =>{
    e.preventDefault();

    const fuenteEvento = e.target;

    // ------------------- Validación required y espacios en blanco
    const validarTitulo = validarSubmit(fuenteEvento, 'titulo-tarea');
    const validarCuerpo = validarSubmit(fuenteEvento, 'tarea');

    // ------------------- Regresar al formulario si alún campo no cumple la validación
    if((!validarTitulo) || (!validarCuerpo)) {
        fuenteEvento['titulo-tarea'].focus();
        return;
    }

    crearTarea(fuenteEvento);
    formatearTarea(null, fuenteEvento);

    fuenteEvento.reset();
    fuenteEvento['titulo-tarea'].focus();
};

// ------------------- Al soltar la tecla (backspace solo funciona con keyup)
const keyup = (e) =>{
    e.stopPropagation();

    const fuenteEvento = e.target;

    if(fuenteEvento.id === 'titulo-tarea') {
        validarKeyUp(fuenteEvento, e.code);
    }

    if(fuenteEvento.id === 'tarea') {
        validarKeyUp(fuenteEvento, e.code);
    }
};

// ------------------- Al cambiar
const change = (e) =>{
    e.stopPropagation();

    const fuenteEvento = e.target;

    if(fuenteEvento.id === 'titulo-tarea') {
        validarChange(fuenteEvento);
        validarChange(formulario.querySelector('#tarea'));
    }

    if(fuenteEvento.id === 'tarea') {
        validarChange(fuenteEvento);
        validarChange(formulario.querySelector('#titulo-tarea'));
    }

    fuenteEvento.focus();
};

// ------------------- Delegación de eventos
//
// ------------------- Al cargar el documento
document.addEventListener('DOMContentLoaded', (e) => {
    getTareasLocalStorage();
});

// ------------------- Al hacer click
listaTareas.parentElement.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    // ------------------- Terminar tarea
    if(fuenteEvento.matches('.fa-square')) {
        modificarStatusTarea(fuenteEvento);
    }
    
    // ------------------- Modificar tarea
    if(fuenteEvento.matches('.fa-square-check')) {
        modificarTarea(fuenteEvento.dataset.idTarea);
    }

    // ------------------- Actualizar tarea
    if(fuenteEvento.matches('#agregar-tarea') && (fuenteEvento.textContent === 'Modificar')) {
        e.preventDefault();
        actualizarTarea(fuenteEvento);
    }
    
    // ------------------- Eliminar tarea
    if(fuenteEvento.matches('.fa-square-minus')) {
        eliminarTarea(fuenteEvento.dataset.idTarea);
    }
});

// ------------------- Asociar varios eventos a un mismo elemento
['submit', 'keyup', 'change'].forEach((eventType) => {
    formulario.addEventListener(eventType, (e) => {
        switch(eventType) {
            case 'submit':
                const botonAccion = formulario.querySelector('#agregar-tarea');

                // ------------------- Si la actualización se hizo por enter, hace submit
                if(botonAccion.hasAttribute('data-id-tarea')) {
                    actualizarTarea(botonAccion);
                    return;
                }

                submit(e);
                break;
            case 'keyup':
                keyup(e);
                break;
            case 'change':
                change(e);
                break;
        }
    });
});
