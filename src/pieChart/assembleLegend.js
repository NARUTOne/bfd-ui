import d3 from 'd3'
import drawPie from './drawPie'
import assembleTooltip from './assembleTooltip'


export default env => {

  d3.select(env.container)
    .append('div')
    .attr('class', 'legend')
    .style('position', 'absolute')
    .style('right','10px')   
    .style('top','10px') 
    .selectAll('div')
    .data(env.config.data)
    .enter()
    .append('div')
    .style('cursor', 'pointer')
    .style('display','block')
    .on('click', function(d, i) {

      let node = d3.select(this);

      let isDisabled = node.classed('disabled');

      node.classed('disabled', !isDisabled);    

      //update env.config.data
      isDisabled ? env.config.dataLegend.push(d) :
        env.config.dataLegend = (function() {
          var arr = [];
          (env.config.dataLegend).map((_d, _i) => {
            if (_d.name !== d.name && _d.value !== d.value) {
              arr.push(_d);
            }
          });         
          return arr;
        })();
     
      //clear pie
      env.svg.select('.pie-slices').selectAll('path').remove();
      env.svg.select('.pie-labels').selectAll('text').remove();
      env.svg.select('.pie-lines').selectAll('polyline').remove();
      //draw pie repeat
      drawPie(env,false);
      //add tooltip
      assembleTooltip(env);

    })
    .each(function(d, i) {
      let node = d3.select(this);
      node.append('span')
        .attr('class', 'legend-rect')
        .style('background-color', d.color);
      node.append('span').text(d.name);
    });
}