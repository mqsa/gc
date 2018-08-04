//作者: mqsa@foxmail.com
//日期: 2018-07-10
const Graph = require('../lib/algorithms/src/data_structures/graph');
const scc = require('../lib/algorithms/src/graph').strongConnectedComponent;
const bellmanFord = require('../lib/algorithms/src/graph').bellmanFord;

const _ = require('lodash');

const union = (x, y) => _.union(x, y);

function buildGraph(edges, directed) {
  const vertexes = edges.reduce(union, []);
  const graph = new Graph(directed);
  vertexes.map(v => graph.addVertex(v));
  edges.map(e => graph.addEdge(...e, 1));
  return { graph, vertexes };
}

//@return {Array} 返回所有强连通分量上的顶点
function vscc(graph) {
  return _(scc(graph).id)
    .invertBy()
    .pickBy(v => v.length > 1)
    .values()
    .reduce(union, []);
}

//@param n {Integer}
//@return {Array} 返回长度大于n的最短路径上的顶点
function vsp(graph, vertexes, n, callback) {
  const sp = vertexes
    .map((v, i) => {
      callback(`${i + 1}/${vertexes.length}`);
      return { [v]: bellmanFord(graph, v).distance };
    })
    .map(x => _.mapValues(x, v => _.pickBy(v, isFinite)))
    .reduce(_.assign, {});


  //排除最短路径上的分支
  const visp = (x, s) => {
    const maxDistance = _(x).values().max();
    const ends = _(x).pickBy(v => v === maxDistance).keys().value();
    return _(x).pickBy((v, k) => sp[s][k] !== undefined
      && ends.find(e => sp[k][e] !== undefined)).value();
  };

  return _(sp)
    .pickBy(x => _(x).values().max() >= n)
    .mapValues(visp)
    .values()
    .map(_.keys)
    .reduce(union, []);
}

function markGC(edges, n, callback) {
  const { graph, vertexes } = buildGraph(edges, true);
  const cv = _.union(vscc(graph), vsp(graph, vertexes, n, callback));
  const ce = edges.filter(([x, y]) => cv.includes(x) && cv.includes(y));
  const cg = buildGraph(ce, false);

  const cid = scc(cg.graph).id;
  return ce.map(([s, t]) => [
    cid[s] === cid[t] ? cid[s] : null, s, t
  ]);
}

module.exports = markGC;
