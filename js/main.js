$(document).ready(function() {
    d3.json('excel_parser.php', function (error, data) {
        if (data) {
            var graph = new Graph();
            var options = {
                element: '#graph',
                data: data,
                height: 800
            };
            graph.draw(options);

            $('#filter_relationships, #filter_definition').change(function() {
                var def = $('#filter_definition').val(),
                    rel = $('#filter_relationships').val();

                var options = {
                    element: '#graph',
                    height: 800
                };

                var filtered = {}
                filtered['nodes'] = [];
                filtered['links'] = data.links;

                var nodes = data.nodes;

                for (var i = 0; i < nodes.length; i ++) {
                    if (def.length > 0 && rel.length > 0 && (def == nodes[i]['def'] || rel == nodes[i]['rel'])) {
                        filtered['nodes'].push(nodes[i]);
                    }
                    if (def.length > 0 && rel.length == 0 && def == nodes[i]['def']) {
                        filtered['nodes'].push(nodes[i]);
                    }
                    if (def.length == 0 && rel.length > 0 && rel == nodes[i]['rel']) {
                        filtered['nodes'].push(nodes[i]);
                    }
                    if (def.length == 0 && rel.length == 0) {
                        filtered['nodes'].push(nodes[i]);
                    }
                }

                options['data'] = filtered;

                graph.draw(options);
            });
        }
    });
});