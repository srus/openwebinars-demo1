(function (window, document) {
    "use strict";

    // {Object} - Rutas y descripción de las imágenes.
    var config,

        // {NodeList} - Almacena los nodos celda de la cuadrícula.
        cells,

        // {int} - Iterator
        iCells,

        // {Array} - Almacena la pareja actualmente seleccionada. Cada
        //           elemento se representa con un objeto literal con
        //           tres propiedades: El nodo "celda", el nodo "imagen",
        //           y el nombre de la imagen.
        couple = [],

        // {Boolean} - Bandera de bloqueo para evitar que se seleccionen más de
        //             dos imágenes al mismo tiempo.
        locked = false;



    config = {
        themesPath: 'img/shapes/',
        currentTheme: 'superheroes',
        themes: {
            superheroes: {
                dirpath: 'superheroes/',
                suffix: 'sph',
                ext: '.jpg'
            }
        }
    };

    //---------------------------- Funciones -----------------------------------

    /**
     * Crea un array con números aleatorios no repetidos empezando por 1.
     * @param {Number} size - el tamaño del array.
     */
    function createRandomSet(size) {
        var xs, i, j, k;

        for (i = 1, xs = []; i <= size; i += 1) {
            xs[i - 1] = i;
        }

        i = size;
        while (i > 1) {
            i -= 1;
            j = Math.random() * i | 0;
            k = xs[i];
            xs[i] = xs[j];
            xs[j] = k;
        }

        return xs;
    }

    /**
     * Crea ruta de una imagen.
     * @param {Object} config - rutas y descripción de las imágenes.
     * @param {Number} n - el número identificador de la imagen.
     */
    function createImgPath(config, n) {
        var currentTheme, themes;

        themes = config.themes;
        currentTheme = config.currentTheme;

        return config.themesPath +
                themes[currentTheme].dirpath +
                themes[currentTheme].suffix +
                n + themes[currentTheme].ext;
    }

    /**
     * Crea imágenes y las añade a las celdas.
     * @param {Object} config - rutas y descripción de las imágenes.
     * @param {NodeList} cells - Las celdas de la cuadrícula.
     */
    function setImages(config, cells) {
        var size = cells.length,
            half = size / 2,
            set1 = createRandomSet(half),
            set2 = createRandomSet(half),
            img1,
            img2,
            i;

        for (i = 0; i < set1.length; i += 1) {
            // Crear todas las imágenes y añadirlas a las celdas de
            // la cuadrícula. Las imágenes se van añadiendo de dos en dos,
            // configurando la ruta de cada imagen a partir de los conjuntos de
            // números aleatorios `set1` y `set2`.
            img1 = new Image();
            img2 = new Image();
            img1.draggable = false;
            img2.draggable = false;
            img1.src = createImgPath(config, set1[i]);
            img2.src = createImgPath(config, set2[i]);
            cells[i].appendChild(img1);
            cells[i + 8].appendChild(img2);
        }
    }

    /**
     * Manejador del evento 'click'.
     */
    function clickHandler() {
        var self = this,
            img,
            imgName,
            item1,
            item2;

        if (!locked) {

            // - Eliminar el manejador del evento en la celda actual (para evitar más clicks).
            // - Obtener el nodo imagen de la celda, mostrar la imagen y
            //   almacenar un nuevo objeto al array `couple`.
            self.removeEventListener('click', clickHandler);
            img = self.querySelector("img");
            img.style.opacity = 1;
            couple.push(self);

            if (couple.length === 2) {

                // Levantar la bandera de bloqueo y extraer la pareja.
                locked = true;
                item1 = couple.pop();
                item2 = couple.pop();
                imgName = item1.querySelector("img").getAttribute('src');

                if (imgName === item2.querySelector("img").getAttribute('src')) {

                    // Bajar de nuevo la bandera de bloqueo.
                    locked = false;

                } else {

                    // Crear un temporizador de 2 segundos para ocultar de nuevo
                    // ambas imágenes, añadir de nuevo los manejadores del evento
                    // 'click' de sus celdas y bajar de nuevo la bandera de bloqueo.
                    window.setTimeout(function () {
                        item1.querySelector("img").style.opacity = 0;
                        item2.querySelector("img").style.opacity = 0;
                        item1.addEventListener('click', clickHandler);
                        item2.addEventListener('click', clickHandler);
                        locked = false;
                    }, 2000);

                }

            }
        }
    }

    // Metodo del DOM para obtener todas celdas de la cuadrícula.
    cells = document.querySelectorAll(".grid-cell");

    // Añadir manejadores del evento 'click' a todas las celdas.
    for (iCells = 0; iCells < cells.length; iCells += 1) {
        cells[iCells].addEventListener('click', clickHandler);
    }

    // Llamada a la función principal `setImages()`.
    setImages(config, cells);
}(window, document));
