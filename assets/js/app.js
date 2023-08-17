// ------------------- Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

// ------------------- Colección de tareas
const tareas = {};

// ------------------- Funciones globales
//
// ------------------- Formatear a capitalize la tarea
const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.toLowerCase().substring(1)}`;

// ------------------- Limpia las clases de validación en el input
const formatearTarea = (tarea) => {
    tarea.classList.remove('is-invalid', 'is-valid');
};

// ------------------- Funciones CRUD
// 
// ------------------- Crear una nueva tarea en el objeto tareas
const crearTarea = (tarea) => {
    const nuevaTarea = {
        // ------------------- Devolver un número aleatorio entre 0-1 convertirlo a alfanumérico y elimnar la parte entera y el .
        // ------------------- Devolver el milisegundo de creación y unir ambas cosas en una cadena para un uuid único
        id: Math.random().toString(36).substring(2) + Date.now(),
        title: capitalize(tarea.value.trim()),
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
        const pTitle = clonListaTareasTemplate.querySelector('.alert p');

        pTitle.textContent = tareas[tarea.id].title;
        pTitle.dataset.idTarea = tareas[tarea.id].id;

        // ------------------- Recorrer los botones de acción y asignarles el dataset con el id de la tarea
        clonListaTareasTemplate.querySelectorAll('.alert h3 i').forEach((tagI) => {
            // ------------------- Comprobar si la tarea está terminada
            if((tareas[tarea.id].status)) {
                // ------------------- Asignar las clases correspondientes al status
                pTitle.classList.toggle('text-decoration-line-through');

                if(tagI.matches('.fa-arrow-rotate-left') || tagI.matches('.fa-circle-check')) {
                    tagI.classList.toggle('d-none');
                }
            }

            tagI.dataset.idTarea = tareas[tarea.id].id;
        });

        fragmentlistaTareasTemplate.appendChild(clonListaTareasTemplate);
    });

    listaTareas.appendChild(fragmentlistaTareasTemplate);
};

// ------------------- Modifica el estado de la tarea del id especificado
const modificarStatusTarea = (botonAccion) => {
    // ------------------- Modificar el status de la tarea a terminado o no terminado
    tareas[botonAccion.dataset.idTarea].status = !tareas[botonAccion.dataset.idTarea].status;

    // ------------------- Comprobar que botón de acción es, para mostrarlo u ocultarlo
    if(botonAccion.classList.contains('fa-circle-check')) {
        botonAccion.classList.toggle('d-none');
        botonAccion.previousElementSibling.classList.toggle('d-none');
    }
    else if(botonAccion.classList.contains('fa-arrow-rotate-left')) {
        botonAccion.classList.toggle('d-none');
        botonAccion.nextElementSibling.classList.toggle('d-none');
    }

    // ------------------- Tachar o destachar la tarea dependiendo del botón de acción
    const cuerpoTarea = listaTareas.querySelector(`p[data-id-tarea="${botonAccion.dataset.idTarea}"]`);

    cuerpoTarea.classList.toggle('text-decoration-line-through');
};

// ------------------- Acceder a la tarea para realizar su actualización
const modificarTarea = (idTarea) => {
    if(tareas[idTarea].status) {
        formulario.querySelector('#tarea').value = tareas[idTarea].title;

        const botonAccion = formulario.querySelector('#agregar-tarea');

        botonAccion.textContent = 'Modificar';
        botonAccion.dataset.idTarea = idTarea;
    }
};

// ------------------- Actualiza la tarea con los parámetros dados
const actualizarTarea = (botonAccion) => {
    // ------------------- Actualizar la tarea
    const tarea = formulario.querySelector('#tarea');

    tareas[botonAccion.dataset.idTarea].status = false;
    tareas[botonAccion.dataset.idTarea].title = tarea.value;

    // ------------------- Cambiar el estado de los botones
    listaTareas.querySelectorAll(`i[data-id-tarea="${botonAccion.dataset.idTarea}"]`).forEach((boton) => {
        if(boton.classList.contains('fa-arrow-rotate-left') 
        || boton.classList.contains('fa-circle-check')) {
            boton.classList.toggle('d-none');
        }
    });

    // ------------------- Resetear el formulario a su estado base
    tarea.value = '';
    botonAccion.textContent = 'Agregar';
    botonAccion.removeAttribute('data-id-tarea');

    leerTareas();
    formatearTarea(tarea);
    tarea.focus();
};

// ------------------- Elimina la tarea del id especificado
const eliminarTarea = (idTarea) => {
    delete tareas[idTarea];
    leerTareas();
    formulario.firstElementChild.focus();
};

// ------------------- Funciones de eventos
// 
// ------------------- Al hacer submit
const submit = (e) =>{
    e.preventDefault();

    const fuenteEvento = e.target;

    // ------------------- Validación required y espacios en blanco
    if(fuenteEvento['tarea'].value.trim().length === 0) {
        fuenteEvento['tarea'].classList.add('is-invalid');
        fuenteEvento['tarea'].focus();

        // ------------------- Si no pasa la validación se
        return;
    }

    crearTarea(fuenteEvento['tarea']);
    formatearTarea(fuenteEvento['tarea']);

    fuenteEvento.reset();
    fuenteEvento['tarea'].focus();
};

// ------------------- Al soltar la tecla (backspace solo funciona con keyup)
const keyup = (e) =>{
    e.stopPropagation();

    const fuenteEvento = e.target;

    // ------------------- Si el input tiene valor y no es un espacio en blanco es válido
    if((fuenteEvento.value.trim().length > 0) 
    && (fuenteEvento.classList.contains('is-invalid'))) {
        fuenteEvento.classList.remove('is-invalid');
        fuenteEvento.classList.add('is-valid');
    }

    // ------------------- Si al borrar el campo queda vacío, es inválido
    if((e.code === 'Backspace') 
    && (fuenteEvento.value.trim().length === 0) 
    && (fuenteEvento.classList.contains('is-valid'))) {
        fuenteEvento.classList.add('is-invalid');
        fuenteEvento.classList.remove('is-valid');
    }
};

// ------------------- Al cambiar
const change = (e) =>{
    e.stopPropagation();

    const fuenteEvento = e.target;

    // ------------------- Si el input tiene valor y no es un espacio en blando, es válido
    if(fuenteEvento.value.trim().length > 0) {
        fuenteEvento.classList.remove('is-invalid');
        fuenteEvento.classList.add('is-valid');
    }
    // ------------------- Si el input tiene está vacío, se resetea el formulario y se coloca el input inválido
    else {
        fuenteEvento.classList.add('is-invalid');
        fuenteEvento.classList.remove('is-valid');
        formulario.reset();
    }

    fuenteEvento.focus();
};

// ------------------- Delegación de eventos
//
// ------------------- Al hacer click
listaTareas.parentElement.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    // ------------------- Terminar tarea
    if(fuenteEvento.matches('.fa-circle-check')) {
        modificarStatusTarea(fuenteEvento);
    }
    
    // ------------------- Modificar tarea
    if(fuenteEvento.matches('.fa-arrow-rotate-left')) {
        modificarTarea(fuenteEvento.dataset.idTarea);
    }

    // ------------------- Actualizar tarea
    if(fuenteEvento.matches('#agregar-tarea') && (fuenteEvento.textContent === 'Modificar')) {
        e.preventDefault();
        actualizarTarea(fuenteEvento);
    }
    
    // ------------------- Eliminar tarea
    if(fuenteEvento.matches('.fa-circle-minus')) {
        eliminarTarea(fuenteEvento.dataset.idTarea);
    }
});

// ------------------- Asociar varios eventos a un mismo elemento
['submit', 'keyup', 'change'].forEach((eventType) => {
    formulario.addEventListener(eventType, (e) => {
        switch(eventType) {
            case 'submit':
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
