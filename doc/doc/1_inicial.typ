= Propuesta incial
En la propuesta inicial se describió el conjunto de datos a utilizar, el objetivo de la visualización, el enfoque inicial y las herramientas. La mayoría de estos puntos se han mantenido a lo largo del desarrollo del proyecto, aunque el enfoque inicial ha variado un poco.

El conjunto de datos es _Space Mission Dataset: 1957-2024_ #footnote[_Space Mission Dataset_: https://www.kaggle.com/datasets/mzeeshanaltaf/space-mission-dataset-1957-2024] y contine información acerca del nombre de la misión, la localización, la fecha, el estado de la misión, el estado del cohete, el precio y el nombre de la organización que llevo a
cabo la misión.

El objetivo principal es enfocar la visualización hacia el _data storytelling_, utilizando el conjunto de datos para mostrar la evolución de la carrera espacial. Como objetivo secundario también se podría incluir en este análisis información de los países con más misiones espaciales realizadas y ver como a lo largo del tiempo distintos países se han ido incorporando.

El enfoque inicial es el siguiente:

- Un histograma que representase el número de misiones realizadas por año
- Un diagrama de donut o tarta con el porcentaje de misiones de cada estado (fracaso, parcialmente fracaso, fracaso antes del lanzamiento, éxito)
- Para representar la carrera espacial un gráfico de líneas, de manera que en los ejes están en número de misiones y los años, y en el gráfico se representan dos líneas, cada una de un color, con las misiones de EEUU y de la URSS.
- Para representar el número de misiones enviadas por cada país por año se podría utilizar un diagrama de dispersión con _jitter_, coloreando los puntos según el estado de la misión.

Las herramientas que van a ser utilizadas son Altair #footnote[_Vega altair_: https://altair-viz.github.io/] o en caso de necesitar más interactividad, D3 #footnote[D3: https://d3js.org/].
