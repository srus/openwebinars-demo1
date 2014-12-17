(function(window, document) {

    'use strict';

        // {Object} - Rutas y descripción de las imágenes.
    var config,

        // {NodeList} - Almacena los nodos celda de la cuadrícula.
        cells,

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


    cells = document.querySelectorAll('.grid-cell');

    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', clickHandler, false);
    }

    setImages(config, cells);



    //---------------------------- Funciones -----------------------------------

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

        for (i = 0; i < size; i += 2) {
            img1 = new Image();
            img2 = new Image();
            img1.draggable = false;
            img2.draggable = false;
            img1.src = createImgPath(config, set1[i / 2]);
            img2.src = createImgPath(config, set2[i / 2]);
            cells[i].appendChild(img1);
            cells[i + 1].appendChild(img2);
        }
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
     * Crea un array con números aleatorios no repetidos empezando por 1.
     * @param {Number} size - el tamaño del array.
     */
    function createRandomSet(size) {
        var xs, i, j, k;

        for (i = 1, xs = []; i <= size; i++) {
            xs[i - 1] = i;
        }

        i = size;
        while (i > 1) {
            i--;
            j = Math.random() * i | 0;
            k = xs[i];
            xs[i] = xs[j];
            xs[j] = k;
        }

        return xs;
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
            self.removeEventListener('click', clickHandler, false);
            img = self.firstElementChild;
            img.style.opacity = 1;
            imgName = img.src.split('/').pop();
            couple.push({cell: self, img: img, imgName: imgName});

            if (couple.length === 2) {
                locked = true;
                item1 = couple.pop();
                item2 = couple.pop();

                if (item1.imgName === item2.imgName) {
                    locked = false;
                } else {
                    setTimeout(function() {
                        item1.cell.addEventListener('click', clickHandler, false);
                        item2.cell.addEventListener('click', clickHandler, false);
                        item1.img.style.opacity = 0;
                        item2.img.style.opacity = 0;
                        locked = false;
                    }, 2000);
                }
            }
        }
    }

}(window, document));
