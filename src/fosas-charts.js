$(document).ready(
		function() {
			var sql = new cartodb.SQL({user:'vidascontadas'});
			/* Provincias */
			var diameter = 500, 
			height = 400,
			format = d3.format(",d"), 
			color = d3.scale.category20c();

			var bubble = d3.layout.pack().sort(null).size(
					[ diameter, height]).padding(1.5);

			var svg_prov = d3.select("#provincia")
				.append("svg").attr("width", diameter)
				.attr("height", height)
				.attr("class", "bubble");

			sql.execute("SELECT provincia,sum(victimas) total FROM fosas group by provincia order by total")
				.done(function(data){
					if(data.total_rows>0){
						var total = 0;
						var children = []
						$.each(data.rows,function(index,item){
							children.push({id:"bubble-"+(index+1),name:item.provincia,value:item.total});
						});
						var nodes = {id:"bubble-0",children:children};
						var node = svg_prov.selectAll('.node')
							.data(bubble.nodes(nodes))
							.enter()
							.append('g')
								.attr('class','node')
								.attr('id',function(d){return d.id})
								.attr('transform',function(d){ return "translate(" + d.x + "," + d.y + ")";});
						
						node.append("title").text(function(d) {
							return d.name + ": " + format(d.value);
						});

						node.append("circle").attr("r", function(d) {
							return d.r;
						}).style("fill", function(d) {
							return color(d.name);
						});

						node.append("text")
							.attr("dy", ".3em")
							.style("text-anchor","middle").text(function(d) {
								text = d.name + " (" + format(d.value)+")";
							return text.substring(0, d.r / 3);
						});
					}
				})
				.error(function(errors){
					
				});
			
			/* Tipo fosa */
			color2 = d3.scale.category20c();
			var svg_fosa = d3.select("#tipo-fosa")
			.append("svg").attr("width", diameter)
			.attr("height", height)
			.attr("class", "bubble");

			sql.execute("SELECT tipo,count(*) total FROM fosas group by tipo order by total")
			.done(function(data){
				if(data.total_rows>0){
					var total = 0;
					var children = []
					$.each(data.rows,function(index,item){
						children.push({id:"bubble-"+(index+1),name:item.tipo,value:item.total});
					});
					var nodes = {id:"bubble-0",children:children};
					var node = svg_fosa.selectAll('.node')
						.data(bubble.nodes(nodes))
						.enter()
						.append('g')
							.attr('class','node')
							.attr('id',function(d){return d.id})
							.attr('transform',function(d){ return "translate(" + d.x + "," + d.y + ")";});
					
					node.append("title").text(function(d) {
						return d.name + ": " + format(d.value);
					});

					node.append("circle").attr("r", function(d) {
						return d.r;
					}).style("fill", function(d) {
						return color2(d.name);
					});

					node.append("text")
						.attr("dy", ".3em")
						.style("text-anchor","middle").text(function(d) {
							text = d.name + " (" + format(d.value)+")";

						return text.substring(0, d.r / 3);
					});
				}
			})
			.error(function(errors){
				
			});
			
			/* Tipo actuacion*/
			sql.execute("SELECT promotor_actuacion as label,count(promotor_actuacion) as value from fosas group by promotor_actuacion")
			.done(function(data){
				nv.addGraph(function() {
					  var chart = nv.models.pieChart()
					      .x(function(d) { return d.label })
					      .y(function(d) { return d.value })
					      .showLabels(true)     //Display pie labels
					      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
					      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
					      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
					      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
					      ;

					  console.log(data.rows);
					    d3.select("#promotor_actuacion").append('svg');
					    d3.select("#promotor_actuacion svg")
					        .datum(data.rows)
					        .transition().duration(350)
					        .call(chart);

					  return chart;
					});
			})
			.error(function(errors){
				
			});
			/* Fosas con actuacion*/
			sql.execute("select 'Sin actuación' as label, count(*) as value from fosas  where promotor_actuacion='Sin datos' union  select 'Con actuación' as label, count(*) as value from fosas  where promotor_actuacion!='Sin datos'")
			.done(function(data){
				nv.addGraph(function() {
					  var chart = nv.models.pieChart()
					      .x(function(d) { return d.label })
					      .y(function(d) { return d.value })
					      .showLabels(true)     //Display pie labels
					      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
					      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
					      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
					      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
					      ;

					  console.log(data.rows);
					    d3.select("#fosas_actuacion").append('svg');
					    d3.select("#fosas_actuacion svg")
					        .datum(data.rows)
					        .transition().duration(350)
					        .call(chart);

					  return chart;
					});
			})
			.error(function(errors){
				
			});

		});