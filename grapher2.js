$(function(){
  connections = {}
  
  graph = new jsgraph(
    graphData, 
    'container', 
    {w:700, h:800,"eventCallbacks":{
          onEdgeType: function(className){
            $('#legend').children().hide()
            $('#edge_'+title).show()
            $('#edge_'+title).children('.connection').show('fast')
          },
          offEdgeType:function(className){
            console.log(className)
            $('#legend').children().show()
            $('.connection').hide()
          }}}
  )
  $.each(graph.edges, function(i,e){
    $('#legend').append(
      '<div id="edge_' + e.type + '">'
      + '<span class="square">■</span>'
      + '<span class="edge-name">'+e.type+' ('+e.count+')</span>'
      +'</div>')
    $('#edge_'+ e.type)
      .children('span.square')
      .css('color', 
        $('#container svg').children('a[title="'+e.type+'"]').children('path').css('stroke'))
  })
})

function jsgraph(data, container, options){
  this.nodes      = this.normalize(data.nodes)
  this.edges      = this.normalize(data.edges, 'connections')
  this.container  = container
  var options 	  = options
  this.paper      = Raphael(document.getElementById(container), options.w, options.h);
  var cNodes	    = this.drawNodes(options)
  var cEdges      = this.drawEdges(cNodes, options)
  this.launchEvents(options.eventCallbacks)
}

jsgraph.prototype.launchEvents = function(callbacks) {
  var callbacks = callbacks
  var self = this
  $('#'+this.container+' svg a').hover(function(){
    title = $(this).attr('title')
    $('svg a path').css('opacity', 0.15)
    $('svg').children('a[title="'+title+'"]').children().css('opacity', 1)
    $('.connection').hide()
    callbacks.onEdgeType(title)
  },function(){
    $('#'+self.container+' svg a path').css('opacity', 1)
    $('#legend').children().show()
    $('.connection').hide()
    callbacks.offEdgeType(title)
  })
}

jsgraph.prototype.drawEdges = function(cNodes, options) {
  var edgeCounter = this.countEdges(this.edges)
  var self = this;
  var cEdges = {}

  $.each(this.edges, function(j, el) {
    $.each(el.connections, function (i,e){
      if (cNodes[e.source] !== undefined) {
        var startNode = cNodes[e.source][0]['attrs']
        var endNode   = cNodes[e.target][0]['attrs']
        var maxFlex   = 100
        var eachFlex  = maxFlex / edgeCounter[e.source][e.target]['index'] 
        var edgeFlex  = maxFlex  - eachFlex * edgeCounter[e.source][e.target]['count'] 

        curveApex     = (startNode.cy+endNode.cy)/2 + edgeFlex

        pathString    = 'M'+startNode.cx+','+startNode.cy
                        + 'S'+options.w/2+','+ curveApex +','+600+','+endNode.cy
        cEdges[i] = self.paper.path(pathString).toBack()
        cEdges[i].attr({
          'stroke-width': 2 + 10 * e.weight,
          'stroke-opacity': 0.7,
          'stroke': getColor(self.edges.length, j),
          'title': el.type})
        edgeCounter[e.source][e.target]['count'] ++
      }
    })
  })

  return cEdges
}

function getColor(total, index)
{
  colorStep = Math.floor(340/total+1)
  return Raphael.hsl(colorStep*index, 80, 55)
}

jsgraph.prototype.countEdges = function(edges) {
  count = {}
  $.each(edges, function(j,el) {
    $.each(el.connections, function(i, e) {
      if (count[e.source] === undefined)
        count[e.source] = {}

      if (count[e.source][e.target] !== undefined) {
        count[e.source][e.target]['index'] ++
      } else {
        count[e.source][e.target] = {index: 0, count:1}
      }
    })
  })
  return count
}

jsgraph.prototype.drawNodes = function(options){
  var cNodes      = {}
  var maxHeight   = options.h/(this.nodes.length*2)
  var maxWidth    = options.w/8
  var maxDiameter = (maxWidth < maxHeight) ? maxWidth : maxHeight
  var currentY    = maxHeight
  var self        = this

  $.each(this.nodes, function(i,e) {

    cNodes[e.type] = self.paper.set(
      self.paper.circle(maxDiameter, currentY, 2 + maxDiameter * e.weight).attr('fill', 'white'),
      self.paper.text(maxDiameter, currentY, e.type),
      self.paper.text(maxDiameter, currentY + 10, e.count))
    self.paper.circle(options.w - maxDiameter, currentY, 2 +maxDiameter * e.weight).attr('fill', 'white'),
    currentY += maxHeight*2
  })
  return cNodes
}


jsgraph.prototype.normalize = function(set, property) {
  var maxItem = 0
  var item    = {}
  var result  = []
  
  if (property === undefined)
    $.each(set, function(i, e){
      if (e.count > maxItem) 
        maxItem = e.count
    })
  else 
    $.each(set, function(j, el){
      $.each(el[property], function(i, e){
        if (e.count > maxItem) 
          maxItem = e.count
      })
    })
  
  return set.map(function(item){
    if (property === undefined)
  	  item['weight'] = item.count/ maxItem;
    else 
      $.each(item[property], function(i, e){
        item[property][i]['weight'] = e.count/ maxItem;
      });
    return item
  })
}




jM = {
  randInt : function(min, max) {
    return min + Math.floor(Math.random()*(max-min))
  }
}

function numKeys(obj){
    var count = 0
    for(var prop in obj)
        count++
    return count
}