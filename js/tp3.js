let data;
const news2Value = ["fr", "temp", "so2", "fc", "tas", "tad"];
let ingreso;
async function loadData() {
  data = await d3.csv("csv/tp3.csv", d3.autoType);
  draw(data);
  loadSelect();
  addListener();
}

function draw(data) {
  // select a point for which to provide details-on-demand
  const hover = vl
    .selectSingle();
    // .encodings("x") // limit selection to x-axis value
    // .on("mouseover") // select on mouseover events
    // .nearest(true) // select data point nearest the cursor
    // .empty("none"); // empty selection includes no data points

  // define our base line chart of stock values
  const line = vl.markLine()
  .select(hover)
  .encode(
    vl
      .x()
      .field("fecha_hora")
      .type("temporal"),
    vl
      .y()
      .fieldQ("news2")
      .scale({
        type: "linear"
      }),
    vl.color()
      .if(hover, vl.fieldN("ingreso")).value('grey')
  );

  const details = vl.markLine()
  .encode(
    vl.x().fieldQ(vl.repeat('column')),
    vl.y().fieldQ(vl.repeat('row')),
    vl.color().if(hover, vl.fieldO('news2')).value('grey'),
    vl.opacity().if(hover, vl.value(0.8)).value(0.1)
  )
  // .width(140)
  // .height(140)
  .repeat({
    column: ['temp','fr','fc','tas','tad','so2'],
    row: ['news2']
  });

  chartSpec = vl
    .data(data)
    .vconcat(line, details)
    // .width(600)
    // .height(600)
    .toJSON();

  vegaEmbed("#chart", chartSpec);
}

function draw_details(data) {
  // select a point for which to provide details-on-demand
  const hover = vl
    .selectSingle()
    .encodings("x") // limit selection to x-axis value
    .on("mouseover") // select on mouseover events
    .nearest(true) // select data point nearest the cursor
    .empty("none"); // empty selection includes no data points

  // define our base line chart of stock values
  const line = vl.markLine().encode(
    vl
      .x()
      .field("fecha_hora")
      .type("temporal"),
    vl
      .y()
      .fieldQ("number")
      .scale({
        type: "linear"
      }),
    vl.color().fieldN("descripcion"),
    vl.tooltip([
      {
        field: "fecha_hora",
        type: "temporal",
        format: "%b %d, %H:%M",
        title: "Fecha Hora"
      },
      {
        field: "habitacion",
        title: "Habitacion"
      },
      {
        field: "conciencia",
        title: "Conciencia"
      }
    ]) // show the Name and Origin fields in a tooltip
  );
  // shared base for new layers, filtered to hover selection
  const base = line.transform(vl.filter(hover));

  // mark properties for text label layers
  const label = {
    align: "left",
    dx: 5,
    dy: -5
  };
  const label2 = {
    align: "left",
    dx: 25,
    dy: -5
  };
  const white = {
    stroke: "white",
    strokeWidth: 2
  };

  chartSpec = vl
    .data(data)
    .layer(
      line,
      // add a rule mark to serve as a guide line
      vl
        .markRule({
          color: "#aaa"
        })
        .transform(vl.filter(hover))
        .encode(vl.x().fieldT("fecha_hora")),
      // add circle marks for selected time points, hide unselected points
      line
        .markCircle()
        .select(hover) // use as anchor points for selection
        .encode(
          vl
            .opacity()
            .if(hover, vl.value(1))
            .value(0)
        ),
      // add white stroked text to provide a legible background for labels
      base.markText(label, white).encode(vl.text().fieldQ("number")),
      // add text labels for stock values
	  base.markText(label).encode(vl.text().fieldN("descripcion").title("Variable")),
	  base.markText(label2).encode(vl.text().fieldQ("number").title("Valor"))
    )
    .width(600)
    .height(600)
    .toJSON();

  vegaEmbed("#chart2", chartSpec);
}

function loadSelect() {
  const inputSection = new Map();
  const inputRoom = new Map();
  const inputNivelConciencia = new Map();
  const inputCategory = new Map();

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
  });

  inputSection.forEach(value => {
    $("#inputSection").append(`<option value="${value}"> ${value}  </option>`);
  });

  inputRoom.forEach(value => {
    $("#inputRoom").append(`<option value="${value}"> ${value}  </option>`);
  });

  inputNivelConciencia.forEach(value => {
    $("#inputAlert").append(`<option value="${value}"> ${value}  </option>`);
  });

  inputCategory.forEach(value => {
    $("#inputCategory").append(`<option value="${value}"> ${value}  </option>`);
  });
}

function addListener() {
  $("#inputSection").change(function() {
    filter();
  });

  $("#inputRoom").change(function() {
    filter();
  });

  $("#inputAlert").change(function() {
    filter();
  });

  $("#inputCategory").change(function() {
    filter();
  });
}

function filter() {
  filteredData = Object.assign([], data);

  let section = $("#inputSection").val();
  let room = $("#inputRoom").val();
  let alert = $("#inputAlert").val();
  let category = $("#inputCategory").val();

  if (section) {
    filteredData = filteredData.filter(x => {
      return x.seccion === section;
    });
  }

  if (room) {
    filteredData = filteredData.filter(x => {
      return x.habitacion.toString() === room.toString();
    });
  }

  if (alert) {
    filteredData = filteredData.filter(x => {
      return x.nivel_conc === alert;
    });
  }

  if (category) {
    filteredData = filteredData.filter(x => {
      return x.clasificacion === category;
    });
  }

  //draw_details(transpose(data));
  draw(this.filteredData);
}

loadData();

function test() {
  this.filteredData = this.filteredData.filter(
    data => data.ingreso.toString() === "3105435"
  );
  const details = transpose(Object.assign([], this.filteredData));
  draw_details(details);
}

function transpose(data) {
  let transpose = [];
  for (let x = 0; x < data.length; x++) {
    for (let y = 0; y < news2Value.length; y++) {
      transpose.push({
        descripcion: news2Value[y],
        number: data[x][news2Value[y]].toString(),
        fecha_hora: data[x].fecha_hora,
        habitacion: data[x].habitacion,
        conciencia: data[x].nivel_conc
      });
    }
  }
  return transpose;
}
