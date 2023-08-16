// ------------------- Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

const tarea = document.querySelector('#tarea');
const tareas = {};

// ------------------- Funciones
// 
// ------------------- Crear una nueva tarea en el objeto tareas
const agregarTarea = () => {
    const nuevaTarea = {
        // ------------------- Devolver un número aleatorio entre 0-1 convertirlo a alfanumérico y elimnar la parte entera y el .
        id: Math.random().toString(36).substring(2),
        title: capitalize(tarea.value.trim())
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

// ------------------- Delegación de eventos
//
// ------------------- Al hacer submit
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(tarea.value.trim().length > 0) {
        agregarTarea();
    }
});