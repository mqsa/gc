function draw(rootId, nodes, links) {
  const LINK_FILL = '#808888';
  const TEXT_FILL = '#808080';

  const color = d3.scaleOrdinal(d3.schemeCategory20);

  const root = d3.select(rootId);
  const width = root.attr('width');
  const height = root.attr('height');
  root.selectAll('*').remove();

  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('link', d3.forceLink().distance(50).id(x => x.id))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .on('tick', ticked);

  const g = root.append('g');

  root.append('defs')
    .append('marker')
    .attr('fill', LINK_FILL)
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 19)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5');

  const link = g.append('g')
    .attr('class', 'link')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', LINK_FILL)
    .attr('stroke-width', 1)
    .attr('marker-end', 'url(#arrow)');

  let node = g
    .append('g')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .append('circle')
    .attr('fill', d => '#576b95')
    .attr('r', 6)
    .on('dblclick', d => console.log(d))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('title').text(d => d.id);

  let nodeLabels = g.selectAll('.node-label')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'node-label')
    .attr('fill', TEXT_FILL)
    .attr('font-size', '8px')
    .attr('x', 12)
    .attr('dy', '.35em')
    .text(d => d.id);


  // let linkLabels = g.selectAll('.link-label')
  //   .data(links)
  //   .enter()
  //   .append('text')
  //   .attr('class', 'link-label')
  //   .attr('text-anchor', 'middle')
  //   .attr('fill', d => d.class > 2 ? WARNING_FILL: NORMAL_FILL)
  //   .attr('font-size', '8px')
  //   .text(d => d.weight);

  function ticked() {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('cx', d => d.x)
      .attr('cy', d => d.y);

    nodeLabels.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    // linkLabels
    //   .attr('x', d => (d.source.x + d.target.x) / 2)
    //   .attr('y', d => (d.source.y + d.target.y) / 2);
  }

  root.call(d3.zoom().scaleExtent([1 / 4, 4])
    .on('zoom', () => g.attr('transform', d3.event.transform)))
    .on('dblclick.zoom', null);

  function dragstarted(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.1).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    simulation.stop();
    if (!d3.event.active) {
      simulation.alpha(0);
    }
  }

  simulation.nodes(nodes);
  simulation.force('link').links(links);

}
