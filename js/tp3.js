let data;
async function loadData() {
  data = await d3.csv('https://gist.githubusercontent.com/cfsepulveda/c39dec0ac78911c5846a473176b2b629/raw/5fc774bd502099cf098f7dbccc9c1ec66facca76/delitos.csv');
  plot();
}

let plot = function drawScatter() {

  // 1. Access data

  console.log(data);

  // select a point for which to provide details-on-demand
  const hover = vl.selectSingle()
    .encodings('x')  // limit selection to x-axis value
    .on('mouseover') // select on mouseover events
    .nearest(true)   // select data point nearest the cursor
    .empty('none');  // empty selection includes no data points

  // define our base line chart of stock values
  const line = vl.markLine().encode(
    vl.x().field('ano').type('temporal'),
    vl.y().fieldQ('numero').scale({ type: 'linear' }),
    vl.color().fieldN('delito')
  );
  // shared base for new layers, filtered to hover selection
  const base = line.transform(vl.filter(hover));

  // mark properties for text label layers
  const label = { align: 'left', dx: 5, dy: -5 };
  const white = { stroke: 'white', strokeWidth: 2 };

  return vl.data(data)
    .layer(
      line,
      // add a rule mark to serve as a guide line
      vl.markRule({ color: '#aaa' })
        .transform(vl.filter(hover))
        .encode(vl.x().fieldT('ano')),
      // add circle marks for selected time points, hide unselected points
      line.markCircle()
        .select(hover) // use as anchor points for selection
        .encode(vl.opacity().if(hover, vl.value(1)).value(0)),
      // add white stroked text to provide a legible background for labels
      base.markText(label, white).encode(vl.text().fieldQ('numero')),
      // add text labels for stock values
      base.markText(label).encode(vl.text().fieldQ('numero'))
    )
    .width(400)
    .height(400)
    .render();


}

loadData();