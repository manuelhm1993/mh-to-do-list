// ------------------- Variables
const formulario = document.querySelector('#formulario');
const tarea = document.querySelector('#tarea');
const listaTareas = document.querySelector('#lista-tareas');
const listaTareasTemplate = document.querySelector('#lista-tareas-template').content;
const fragmentlistaTareasTemplate = document.createDocumentFragment();

// ------------------- Funciones
const agregarTarea = () => {
    const clonListaTareasTemplate = listaTareasTemplate.cloneNode(true);

    clonListaTareasTemplate.querySelector('.alert p').textContent = capitalize(tarea.value.trim());

    fragmentlistaTareasTemplate.appendChild(clonListaTareasTemplate);
    listaTareas.appendChild(fragmentlistaTareasTemplate);

    formulario.reset();
};

const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.toLowerCase().slice(1)}`;

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