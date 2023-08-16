// ------------------- Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

// ------------------- Colección de tareas
const tareas = {};

// ------------------- Funciones
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

    renderizarTareas();
};

// ------------------- Actualiza la tarea del id especificado
const actualizarTarea = (botonAccion) => {
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
    listaTareas.querySelector(`p[data-id-tarea="${botonAccion.dataset.idTarea}"]`).classList.toggle('text-decoration-line-through');
};

// ------------------- Renderizar el listado de tareas
const renderizarTareas = () => {
    listaTareas.textContent = '';

    Object.values(tareas).forEach((tarea) => {
        const clonListaTareasTemplate = listaTareasTemplate.cloneNode(true);
        const pTitle = clonListaTareasTemplate.querySelector('.alert p');

        pTitle.textContent = tareas[tarea.id].title;
        pTitle.dataset.idTarea = tareas[tarea.id].id;

        // ------------------- Recorrer los botones de acción y asignarles el dataset con el id de la tarea
        clonListaTareasTemplate.querySelectorAll('.alert h3 i').forEach((tagI) => {
            tagI.dataset.idTarea = tareas[tarea.id].id;
        });

        fragmentlistaTareasTemplate.appendChild(clonListaTareasTemplate);
    });

    listaTareas.appendChild(fragmentlistaTareasTemplate);
};

// ------------------- Formatear a capitalize la tarea
const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.toLowerCase().substring(1)}`;

// ------------------- Limpia las clases de validación en el input
const formatearTarea = (tarea) => {
    tarea.classList.remove('is-invalid', 'is-valid');
};

// ------------------- Delegación de eventos
//
// ------------------- Al hacer click
listaTareas.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    if(fuenteEvento.matches('.fa-circle-check')
    || fuenteEvento.matches('.fa-arrow-rotate-left')) {
        actualizarTarea(fuenteEvento);
    }
    else if(fuenteEvento.matches('.fa-circle-minus')) {
        console.log('Tarea eliminada');
    }
});

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
