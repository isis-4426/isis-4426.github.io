const inputSection = new Map();
const inputRoom = new Map();
const inputNivelConciencia = new Map();
const inputCategory = new Map();
const inputIngreso = new Map();

async function loadData() {
  data = await d3.csv("csv/tp3.csv", d3.autoType);
  loadList();
  draw(data);
}

function draw(data) {
  const selectSection = vl
    .selectSingle("seccion")
    .init({ seccion: Array.from(inputSection.values())[0] })
    .fields("seccion")
    .bind(vl.menu(Array.from(inputSection.values())));

  const selectRoom = vl
    .selectSingle("habitacion")
    .fields("habitacion")
    .bind(vl.menu(Array.from(inputRoom.values())));

  const selectNivelConciencia = vl
    .selectSingle("nivel_conc")
    .fields("nivel_conc")
    .bind(vl.menu(Array.from(inputNivelConciencia.values())));

  const selectCategory = vl
    .selectSingle("clasificacion")
    .fields("clasificacion")
    .bind(vl.menu(Array.from(inputCategory.values())));

  const selectIngreso = vl
    .selectSingle("ingreso")
    .fields("ingreso")
    .bind(vl.menu(Array.from(inputIngreso.values())));

  const hover = vl.selectSingle();

  const line = vl
    .markLine()
    .transform(
      vl.filter(
        vl.and(
          selectSection,
          selectRoom,
          selectNivelConciencia,
          selectCategory,
          selectIngreso
        )
      )
    )
    .select(
      selectSection,
      selectRoom,
      selectNivelConciencia,
      selectCategory,
      selectIngreso,
      hover
    )
    .encode(
      vl
        .x()
        .field("fecha_hora")
        .type("temporal"),
      vl
        .y()
        .fieldQ("news2")
        .scale({ type: "linear" }),
      vl
        .color()
        .if(hover, vl.fieldN("ingreso"))
        .value("grey")
    )
    .width(700);

  const details = function(variable) {
    return vl.markLine().encode(
      vl
        .x()
        .fieldQ("fecha_hora")
        .type("temporal"),
      vl.y().fieldQ(variable),
      vl
        .color()
        .if(hover, vl.fieldO("news2"))
        .value("grey"),
      vl
        .opacity()
        .if(hover, vl.value(0.8))
        .value(0.1)
    );
  };

  detailsChart1 = vl.hconcat(details("temp"), details("fr"), details("fc"));
  detailsChart2 = vl.hconcat(details("tas"), details("tad"), details("so2"));

  chartSpec = vl
    .data(data)
    .vconcat(line, detailsChart1, detailsChart2)
    // .width(600)
    // .height(600)
    .toJSON();

  vegaEmbed("#chart", chartSpec);
}

function loadList() {
  data.forEach(element => {
    if (!inputSection.has(element.seccion) && element.seccion) {
      inputSection.set(element.seccion, element.seccion);
    }
    if (!inputSection.has(element.habitacion) && element.habitacion) {
      inputRoom.set(element.habitacion, element.habitacion);
    }
    if (!inputNivelConciencia.has(element.nivel_conc) && element.nivel_conc) {
      inputNivelConciencia.set(element.nivel_conc, element.nivel_conc);
    }
    if (!inputCategory.has(element.clasificacion) && element.clasificacion) {
      inputCategory.set(element.clasificacion, element.clasificacion);
    }

    if (!inputIngreso.has(element.ingreso) && element.ingreso) {
      inputIngreso.set(element.ingreso, element.ingreso);
    }
  });
}

loadData();
