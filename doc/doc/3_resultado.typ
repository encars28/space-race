= Resultado final
La aplicación web muestra una narración visual interactiva de la carrera espacial. Cada página incluye una visualización con interacciones diseñadas para explorar cómo evolucionaron los lanzamientos de Estados Unidos y la Unión Soviética durante el periodo.

Primero se ha proporcionado una visión general de los lanzamientos totales y su distribución por país, éxitos y fallos. Por último se ha presentado interactivamente la evolución temporal de los lanzamientos, destacando los hitos históricos.

== Página de inicio
La página de inicio, mostrada en @home funciona como entrada: muestra el título, una breve descripción y el botón "Empezar" que inicia la experiencia.

Esta página también es la encargada de cargar los datos del archivo, que en caso de no estar preparados muestra una página de espera al usuario mientras se terminan de procesar, como se ve en la @loading.

#figure(
  image("../img/start.png"),
  caption: "Página de inicio",
) <home>

#figure(
  image("../img/loading.png"),
  caption: "Pantalla de carga mientras se procesan los datos",
) <loading>

== Visión general de lanzamientos
Esta vista inicial se muestra el número de lanzamientos en grande al lado de un gráfico de pastel la distribución por países de los lanzamientos durante este periodo de tiempo, como se ve en la @overview.

#figure(
  image("../img/overview.png"),
  caption: "Número y distribución de lanzamientos por país",
) <overview>

Si se pasa el ratón por encima de las secciones del gráfico de pastel, se muestran _tooltips_ con el porcentaje y número total de lanzamientos de cada país, además de mostrar el nombre de todos los países agrupados en otros, como se observa en la @otros.

#figure(
  image("../img/otros.png", width: 69%),
  caption: "Desglose de países en Otros",
) <otros>

== Porcentaje de éxitos y fallos

La siguiente visualización representa el porcentaje de éxitos y fallos, utilizando una matriz de puntos en la que cada punto representa un uno por ciento de lanzamientos.

El gráfico compara el porcentaje de éxitos y fallos por países, utilizando un _tooltip_ para inspeccionar valores concretos.

#figure(
  image("../img/dot.png"),
  caption: "Gráfico dot matrix mostrando el porcentaje de éxitos y fallos",
) <dot>

== Densidad de fallos

La tercera visualización explora un poco más la distribución de los fallos en los lanzamientos a lo largo del tiempo.

Para ellos se superponen dos gráficos de densidad, uno para cada país, como se ve en la @failures. Utilizando un _tooltip_ se pueden inspeccionar el número concreto de lanzamientos fallidos en cada año.

#figure(
  image("../img/failures.png"),
  caption: "Densidad de fallos por año (visualización de densidad)",
) <failures>

== Evolución temporal

Esta es la visualización principal del proyecto, que muestra la evolución de los lanzamientos a lo largo del tiempo.

Gráfico de barras acumuladas con un patrón de scrollytelling: al desplazar la página se avanza por los años y la barra muestra las cuentas acumuladas de lanzamientos por cada país. A la izquierda hay una línea temporal y a la derecha se muestran tarjetas con eventos históricos relevantes para cada año, lo que conecta los datos cuantitativos con hitos cualitativos.

#figure(
  image("../img/sr1.png"),
  caption: "Inicio de la visualización de la evolución de la carrera espacial",
) <sr>

#figure(
  image("../img/sr2.png"),
  caption: "Vista avanzada de la visualización de la evolución de la carrera espacial",
) <sr2>

#figure(
  image("../img/sr3.png"),
  caption: "Aterrizaje en la luna",
) <sr3>

#figure(
  image("../img/sr4.png"),
  caption: "Final de la visualización de la evolución de la carrera espacial",
) <sr4>

== Línea acumulada y conclusiones
Un gráfico de líneas compara las curvas acumuladas de USA y USSR y se acompaña de un panel de conclusiones que sintetiza hallazgos clave (por ejemplo, la victoria simbólica en la carrera lunar de 1969). Esta sección sirve para cerrar la narrativa y ofrecer interpretaciones derivadas de las visualizaciones.

#figure(
  image("../img/final.png"),
  caption: "Gráfico de líneas acumuladas y panel de conclusiones",
) <final>

