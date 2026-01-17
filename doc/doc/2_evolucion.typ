= Evolución del proyecto
Lo primero que se ha hecho al comenzar el proyecto ha sido fijar el objetivo de la visualización. En la propuesta inicial se proponía una visualización de la carrera espacial utilizando los datos de las misiones espaciales, y aparte, una visualización de los países que más tarde incorporaron también programas espaciales.

Como estos dos objetivos

== Preprocesamiento del conjunto de datos

En primer lugar, se parseó la columna de fecha y hora para extraer el año, ya que es la parte de la fecha que se va a usar principalmente en las visualizaciones. Se filtraron las filas para incluir únicamente lanzamientos en el periodo de la carrera espacial, es decir, de 1957 a 1975.

Se añadió también una columna para el país, extraído de los datos de la localización del lanzamiento, ya que al igual que con la fecha, la información del país va a ser la más utilizada.

Con información acerca del país y de la organización responsable del lanzamiento se creó una nueva columna que detalla el superpoder al que pertenece cada lanzamiento: EEUU, URSS u otro.

Se eliminaron columnas no relevantes para la visualización el precio, que contenía demasiados valores nulos para ser útil y el estado del cohete, ya que para lanzamientos tan antiguos el valor para esta columna era prácticamente igual para todos y no aportaba información importante. Por último, se renombró la columna "detalles" a "nombre" para mayor claridad.

El resultado final tras el preprocesamiento se puede apreciar en la figura @data

#figure(
  image("../img/dataset.png"),
  caption: "Vista previa del conjunto de datos tras el preprocesamiento",
) <data>

== Decisión final de herramientas y formato

== Primeras visualizaciones

- Placement de la barra a la izquierda en vez de arriba
- Uso de stacked bar char para el porcentaje de éxitos y fallos
- Uso de pictograma para el total de lanzamientos
- Dot matrix en porcentaje vs normales
- Gráfico de densidad vs gráfico de líneas
- Gráfico de líneas para la visualización interactiva vs final
- Mostrar de manera stacked los lanzamientos actuales del año
- Número encima de las barras
- Por qué visualización de fallos en vez de éxitos
- Exclusión de otros países en todos los gráficos menos el primero
- Decisión scrollytelling vs animación automática
- Agrupamiento de todos los fallos

== Paleta de colores

- Gradiente

== Scroll hint

== Fondo
