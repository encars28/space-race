#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 1.5em, first-line-indent: 1.8em, justify: true)
#set text(font: "New Computer Modern", lang: "es")
#set table(stroke: (_, y) => (bottom: if y == 0 { 0.8pt } else { none }))

#show raw: set text(font: "New Computer Modern Mono", lang: "es")
#show heading: set block(above: 2em, below: 1.2em)
#show figure.caption: set text(size: 10pt)
#show figure: set block(inset: (top: 0.5em, bottom: 0.5em))

#show table.cell.where(y: 0): set text(style: "normal",weight: "black")
#show table.cell.where(x: 0): set text(style: "normal",weight: "bold")
#show table.cell: set block(inset: 2pt)

#set document(
  title: [Sistemas conexionistas],
  author: "María Encarnación Sánchez Sánchez",
  description: [\ Analítica visual \ Máster en Sistemas Inteligentes \ Curso 2025-2026],
)

#let author() = context {
  set text(size: 14pt)
  document.author.first()
}

#let description() = context {
  set text(size: 12pt)
  document.description
}


// title page
#align(center)[
  #v(4cm)
  #title()
  #v(1cm)
  #author()
  #v(6cm)
  #description()
]

//toc
#pagebreak()
#outline(depth: 3)
#pagebreak()

// reset page numbering
#set page(numbering: "1", margin: 3cm)
#counter(page).update(1)

#include "doc/1_inicial.typ"