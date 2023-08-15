// ------------------- Variables
const listaVacia = document.querySelector('input[value="Sin tareas pendientes ❤️"]');
const tarea = document.querySelector('#tarea');
const lista = document.querySelector('#list');

// ------------------- Funciones
const agregarTarea = (tarea) => {
    if(lista.firstElementChild === listaVacia) {
        lista.textContent = '';
    }

    const nuevaTarea = Object.assign(
        document.createElement('input'),
        { 
            type: 'text',
            disabled: true,
            value: capitalize(tarea.value),
            // Se puede pasar el conjunto de clases como key:value de classList
            // classList: 'form-control text-start bg-warning-subtle text-warning-emphasis mb-2'
        }
    );

    tarea.value = '';

    // Pero se practicó el uso del spread operator y el split
    nuevaTarea.classList.add(...'form-control text-start bg-warning-subtle text-warning-emphasis mb-2'.split(' '));

    lista.appendChild(nuevaTarea);
};

const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.toLowerCase().slice(1)}`;

// ------------------- Delegación de eventos
//
// ------------------- Al cargar
window.addEventListener('keypress', (e) => {
    e.stopPropagation();
    
    if(e.key === 'Enter') {
        agregarTarea(tarea);
    }
});

// ------------------- Al hacer click
document.body.firstElementChild.addEventListener('click', (e) => {
    e.stopPropagation();

    const fuenteEvento = e.target;

    if(fuenteEvento.id === 'agregar-tarea') {
        agregarTarea(tarea);
    }
});