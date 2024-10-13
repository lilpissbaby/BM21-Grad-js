// Nada más empezar, el launchpad estará vacío
window.onload = vaciar;


//Recoger todos los elementos "cañón" del grad. Array encargado del DOM
// e inicializar el estado de éste. Nada más emezar, todos seran falsos, osea, vacíos
let launchpad = document.getElementsByClassName("cannon");


// Array paralelo que contiene el valor boolean de si la ranura está cargada o no
let ranuraCargada = [];

// Función para interrumpir la recarga de los disparos
let interrumpir = false;

function interrumpirLanzamiento(){
	interrumpir = true;
}

//////////////////////////////////////
//									//
//	FUNCIONES Y VARIABLES			//
//	GLOBALES NECESARIAS PARA ELLAS	//
//									//
//////////////////////////////////////

// recargar o reiniciar todas las ranuras para misiles
function recargar(){
	for(let i = 0; i < launchpad.length; i++){
		// Ponemos cada casilla del launchpad como verdadera, osea, con un misil listo
		ranuraCargada[i] = true;		
		evaluarEstado(ranuraCargada[i], i);
	}
	
	let sonidoRecarga = new Audio('recargar.wav');
	sonidoRecarga.play();
}

function evaluarEstado(ranuraPorComprobar, index){
	// Si la ranura es verdadera, tal y como se acaba de establecer, se aprovecha y se cambia el color del fondo
	ranuraPorComprobar == true ? 
		launchpad[index].style.backgroundColor = 'red' : 
		launchpad[index].style.backgroundColor = 'grey';
	
	launchpad[index].style.borderColor = 'black';
}

// Configurar la velocidad de lanzamiento. Por defecto será 150
let speed = 150;

function velocidad(velocidad, numBoton){
	let botonRestante1, botonRestante2;
	
	switch(velocidad){
		case 1:
			speed = 200;
			botonRestante1 = 2;
			botonRestante2 = 3;
		break;
		
		case 2:
			speed = 125;
			botonRestante1 = 1;
			botonRestante2 = 3;
		break;
		
		default:
			speed = 80;
			botonRestante1 = 1;
			botonRestante2 = 2;
		break;
	}
	
	// Para el botón de velocidad seleccionado, lo pondremos con "iluminación" amarilla
	let botonVel = document.getElementById('sp' + numBoton);
	botonVel.style.backgroundColor = 'yellow';
	
	// Los demás, el la cyan
	let botonUnselect1 = document.getElementById('sp' + botonRestante1);
	let botonUnselect2 = document.getElementById('sp' + botonRestante2);
	botonUnselect1.style.backgroundColor = 'cyan';
	botonUnselect2.style.backgroundColor = 'cyan';
}

function vaciar(){
	for(let i = 0; i < launchpad.length; i++){
		// Ponemos cada casilla del launchpad como verdadera, osea, con un misil listo
		ranuraCargada[i] = false;		
		evaluarEstado(ranuraCargada[i], i);
	}
	
	let sonidoRecarga = new Audio('vaciar.wav');
	sonidoRecarga.play();
}

// Función que en caso de haber 0 espacios cargados, devolverá false, para que en el panel de info salga si hay 
// o no algo en el lanchpad
function evaluarMunicionLaunchpad(){
	let contarMisiles = 0;
	
	for(let i = 0; i < launchpad.length; i++){
		if(ranuraCargada[i] == true){
			contarMisiles++;
		}
	}
	
	return contarMisiles;
}

function dispararTodo(){
	
	// Pasamos por cada posición del launchpad
	let index = 0;
	
	// Se inicializa antes de la cadena de disparos como falso, por si antes se ha hecho uso de la interrupción
	interrumpir = false;
	
	let interval = setInterval(() => {
        if (index < launchpad.length && ranuraCargada[index] == true && !interrumpir) {
            animacionDisparo(index);
            index++;
			
        }
		else if(ranuraCargada[index] == false){
			index++;
		}
		else {
            clearInterval(interval);
        }
    }, speed); // tiempo entre disparos
	

}

function dispararUno(){
	// Buscar la primera ranura lista
	let indexPrimeraRanuraLista = -1;
	
	for(let i = 0; i < ranuraCargada.length; i++){
		if(ranuraCargada[i] == true){
			indexPrimeraRanuraLista = i;
			break;
		}
	}
	
	// Si no hay ranuras listas, salir de la función
	if (indexPrimeraRanuraLista === -1) {
		return;
	}
	
	animacionDisparo(indexPrimeraRanuraLista);
}

function dispararRafaga(){
	
	// Buscar la primera ranura lista
	let indexPrimeraRanuraLista = -1;
	
	for(let i = 0; i < ranuraCargada.length; i++){
		if(ranuraCargada[i] == true){
			indexPrimeraRanuraLista = i;
			break;
		}
	}
	
	// Si no hay ranuras listas, salir de la función
	if (indexPrimeraRanuraLista === -1) {
		return;
	}
	
	/*	Definir el rango de ranuras a disparar. Teniendo en cuenta la posiciónde la primera ranura
		cargada, podremos saber en cuál de las 4 filas del launchpad está. Por ejemplo, si la primera ranura
		disponible es la 6, se sabe que estamos en la primera fila, porque pasa del 0 y se detiene antes del 10.
		Entonces, la ráfaga empezará en la posición 6 hasta acabar su fila, osea, hasta la posición 9 (la 10 corresponde
		a la siguiente fila)
	*/
	let inicioRafaga, finalRafaga;
	
	if(indexPrimeraRanuraLista < 10){
		// Si el primer misil se encuentra en la primera fila (0 < index 10)...
		inicioRafaga = indexPrimeraRanuraLista;
		finalRafaga = 10;
	}
	else if(indexPrimeraRanuraLista >= 10 && indexPrimeraRanuraLista < 20){
		inicioRafaga = indexPrimeraRanuraLista;
		finalRafaga = 20;
	}
	else if(indexPrimeraRanuraLista >= 20 && indexPrimeraRanuraLista < 30){
		inicioRafaga = indexPrimeraRanuraLista;
		finalRafaga = 30
	}
	else{
		inicioRafaga = indexPrimeraRanuraLista;
		finalRafaga = 40;
	}
	
	// Bucle que empezará a disparar desde el inicio de la primera ranura disponible, hasta el final
	// de esa fila. Ambos valores vienen definidos por el if() anterior
	let interval = setInterval(() => {
        if (inicioRafaga < finalRafaga && ranuraCargada[inicioRafaga] == true) {
            animacionDisparo(inicioRafaga);
            inicioRafaga++;
			
        }
		else {
            clearInterval(interval);
        }
    }, 45); // tiempo entre disparos
	
}

function animacionDisparo(ranuraPorDisparar){
	// Se aisla del launchpad la ranura por disparar
	let ranuraBoom = document.getElementById(ranuraPorDisparar);
	
	// Animación de las "llamas" del misil al ser disparado
	ranuraBoom.style.borderColor = 'orange';
	ranuraBoom.style.backgroundColor = 'white';
	ranuraCargada[ranuraPorDisparar] = false;
	
	// Sonido del cochete del grad
	let sonidoGrad = new Audio('grad.mp3');
	sonidoGrad.playbackRate = 1.5;
	sonidoGrad.play();
	
	setTimeout(() => {
        evaluarEstado(false, ranuraPorDisparar);
    }, 100); // tiempo entre la animación de disparo y el propio disparo
}

function panelBoot(){
	let pantallaInfo = document.getElementById('panel-status');
	
	let animacionBoot = setInterval(() => {
		pantallaInfo.textContent = 'Yo soy la luz del mundo; el que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida.';
	}, 5000);
}

porcentajeTotal();

function porcentajePanel(){
	// Sacar cantidad de misiles
	let porcentajeTotal = evaluarMunicionLaunchpad * 100 / 40;
	
	// Escribir el % en el panel
	let panelInfoPorcent = document.getElementById('porcj-estado');
	panelInfoPorcent.textContent = porcentajeTotal;
}