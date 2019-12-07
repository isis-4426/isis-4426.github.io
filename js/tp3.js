async function loadData() {
  data = await d3.csv("csv/tp3.csv", d3.autoType);
  draw(data);
}

function draw(data) {
  const hover = vl
    .selectSingle();

  const line = vl.markLine()
  .select(hover)
  .encode(
    vl.x().field("fecha_hora").type("temporal"),
    vl.y().fieldQ("news2").scale({type: "linear"}),
    vl.color().if(hover, vl.fieldN("ingreso")).value('grey')
  )
  .width(700);

  const details = function(variable) {
    return vl.markLine()
    .encode(
      vl.x().fieldQ('fecha_hora').type("temporal"),
      vl.y().fieldQ(variable),
      vl.color().if(hover, vl.fieldO('news2')).value('grey'),
      vl.opacity().if(hover, vl.value(0.8)).value(0.1)
    );
  }

  detailsChart1 = vl.hconcat(details('temp'), details('fr'), details('fc'));
  detailsChart2 = vl.hconcat(details('tas'), details('tad'), details('so2'));

  chartSpec = vl
    .data(data)
    .vconcat(line, detailsChart1, detailsChart2)
    // .width(600)
    // .height(600)
    .toJSON();

  vegaEmbed("#chart", chartSpec);
}

loadData();