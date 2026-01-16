= Propuesta incial

== Conjunto de datos
El  conjunto  de  datos  es  _Space  Mission  Dataset:  1957-2024_ #footnote[https://www.kaggle.com/datasets/mzeeshanaltaf/space-mission-dataset-1957-2024] y contine información acerca del nombre de la misión, la localización, la fecha, el estado de la misión, el estado del cohete, el precio y el nombre de la organización que llevo a 
cabo la misión.

La columna de precio tiene bastante datos nulos, por lo que en caso de querer usarlo 
para  la  visualización  necesitaría  generar  más  valores  artificialmente,  o  buscar 
información en la página web Next Spaceflight #footnote[https://nextspaceflight.com/], la página web de la que los datos han sido extraídos. 

== Objetivo de la visualización
Mi  objetivo  es  enfocar  la  visualización  hacia  el  data storytelling. Me  interesa  utilizar  el conjunto de datos para mostrar la evolución de la carrera espacial y cómo el interés por las  misiones  espaciales  ha  ido  variando  a  lo  largo  del  tiempo.  Además,  también  me gustaría incluir en este análisis información de los países con más misiones espaciales realizadas y ver como a lo largo del tiempo distintos países se han ido incorporando.

== Enfoque inicial 
Inicialmente,  había  pensado  hacer  un  histograma  que  representase  el  número  de  misiones realizadas por año y un diagrama de donut o tarta con el porcentaje de misiones  de  cada  estado  (fracaso,  parcialmente  fracaso,  fracaso  antes  del  lanzamiento,  éxito), para tener una vista general.  

Para visualizar mejor la carrera espacial la idea es utilizar un gráfico de líneas, de manera que en los ejes están en número de misiones y los años, y en el gráfico se representan dos líneas, cada una de un color, con las misiones de EEUU y de la URSS. 

Para representar el número de misiones enviadas por cada país por año podría utilizar un  diagrama de dispersión con jitter, coloreando los puntos según el estado de la misión. 

== Herramientas
Mi intención es utilizar Altair o en caso de querer hacer algo un poco más interactivo, D3.