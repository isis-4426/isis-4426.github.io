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

  const details1 = vl.markLine()
  .encode(
    vl.x().fieldQ(vl.repeat('column')).type("temporal"),
    vl.y().fieldQ(vl.repeat('row')),
    vl.color().if(hover, vl.fieldO('news2')).value('grey'),
    vl.opacity().if(hover, vl.value(0.8)).value(0.1)
  )
  // .width(140)
  // .height(140)
  .repeat({
    column: ['fecha_hora'],
    row: ['temp','fr','fc','tas','tad','so2']
  })
  .columns(3);

  chartSpec = vl
    .data(data)
    .vconcat(line, details1)
    // .width(600)
    // .height(600)
    .toJSON();

  vegaEmbed("#chart", chartSpec);
}

loadData();