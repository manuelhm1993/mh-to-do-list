// ------------------- Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

const tareas = {};

// ------------------- Funciones
// 
// ------------------- Crear una nueva tarea en el objeto tareas
const agregarTarea = (tarea) => {
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
    formulario.reset();
};

// ------------------- Renderizar el listado de tareas
const renderizarTareas = () => {
    listaTareas.textContent = '';

    Object.values(tareas).forEach((tarea) => {
        const clonListaTareasTemplate = listaTareasTemplate.cloneNode(true);

        clonListaTareasTemplate.querySelector('.alert p').id = tareas[tarea.id].id;
        clonListaTareasTemplate.querySelector('.alert p').textContent = tareas[tarea.id].title;

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
// ------------------- Al soltar la tecla (backspace solo funciona con keyup)
const keyup = (e) =>{
    e.stopPropagation();

    const fuenteEvento = e.target;

    // ------------------- Si el input tiene valor y no es un espacio en blanco es válido
    if((fuenteEvento.value.trim().length > 0) && fuenteEvento.classList.contains('is-invalid')) {
        fuenteEvento.classList.remove('is-invalid');
        fuenteEvento.classList.add('is-valid');
    }

    // ------------------- Si al borrar el campo queda vacío, es inválido
    if((e.code === 'Backspace') && (fuenteEvento.value.trim().length === 0) && (fuenteEvento.classList.contains('is-valid'))) {
        fuenteEvento.classList.add('is-invalid');
        fuenteEvento.classList.remove('is-valid');
    }
};

// ------------------- Al hacer submit
const submit = (e) =>{
    e.preventDefault();

    const fuenteEvento = e.target;

    if(fuenteEvento['tarea'].value.trim().length > 0) {
        agregarTarea(fuenteEvento['tarea']);

        // ------------------- Quitar las clases de validación al crear la tarea
        formatearTarea(fuenteEvento['tarea']);
    }
    else {
        fuenteEvento['tarea'].classList.add('is-invalid');
        fuenteEvento.reset();
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
};

// ------------------- Asociar varios eventos a un mismo elemento
['submit', 'keyup', 'change'].forEach((eventType) => {
    formulario.addEventListener(eventType, (e) => {
        switch(eventType) {
            case 'submit':
                submit(e);
                console.log('submit');
                break;
            case 'keyup':
                keyup(e);
                console.log('keyup');
                break;
            case 'change':
                change(e);
                console.log('change');
                break;
        }
    });
});
