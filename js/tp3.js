let flag = false;
let flagStart = false;

const inputSection = new Map();
const inputRoom = new Map();
const inputNivelConciencia = new Map();
const inputCategory = new Map();
const inputIngreso = new Map();

async function loadData() {
  data = await d3.csv("../csv/tp3.csv", d3.autoType);
  data = filterDateNow(data);
  loadList();
  draw(data);
  addListener();
  $("#monitor-text")[0].innerHTML=formatDate();
}

function draw(data) {
  const hover = vl.selectSingle();

  const line = vl
    .markLine({ point: true })
    .select(hover)
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
        .field("fecha_hora")
        .type("temporal"),
      vl.y().fieldQ(variable),
      vl
        .color()
        .if(hover, vl.fieldQ("news2"))
        .value("white"),
      vl
        .opacity()
        .if(hover, vl.value(0.8))
        .value(0.1)
    )
    .height(150)
    ;
  };

  detailsChart1 = vl.hconcat(details("temp"), details("fr"), details("fc"));
  detailsChart2 = vl.hconcat(details("tas"), details("tad"), details("so2"));

  chartSpec = vl
    .data(data)
    .vconcat(line, detailsChart1, detailsChart2)
    .toJSON();

  vegaEmbed("#chart", chartSpec);

  $("select").addClass("form-control");
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

  inputSection.forEach(value => {
    if (!flag) {
      $("#inputSection").append(
        `<option value="${value}" selected> ${value}  </option>`
      );
    } else {
      $("#inputSection").append(
        `<option value="${value}"> ${value}  </option>`
      );
    }
    flag = true;
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

  inputIngreso.forEach(value => {
    $("#inputIngreso").append(`<option value="${value}"> ${value}  </option>`);
  });
}

function filterDateNow(data) {
  const now = new Date();
  return data.filter(x => new Date(x.fecha_hora).getDate() === now.getDate());
}

function addListener() {
  let filteredData;

  $("#inputIngreso").change(function() {
    filter();
  });

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
  if (!flagStart) {
    filter();
  }
  flagStart = true;
}

function formatDate() {
  now = new Date();
  mes = now.getMonth() + 1;
  return (
    now.getDate().toString() + "-" + mes + "-" + now.getFullYear()
  );
}

function filter() {
  filteredData = Object.assign([], data);

  let section = $("#inputSection").val();
  let room = $("#inputRoom").val();
  let alert = $("#inputAlert").val();
  let category = $("#inputCategory").val();
  let ingreso = $("#inputIngreso").val();

  if (section) {
    filteredData = filteredData.filter(x => {
      return x.seccion === section;
    });
  }

  if (ingreso) {
    filteredData = filteredData.filter(x => {
      return x.ingreso.toString() === ingreso.toString();
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

  draw(this.filteredData);
}

loadData();
