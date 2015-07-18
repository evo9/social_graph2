$(document).ready(function () {
    d3.json('excel_parser.php', function (error, data) {
        if (data) {
            var graph = new Graph();
            var options = {
                element: '#graph',
                data: {
                    nodes: data.nodes,
                    links: data.links
                },
                height: 800
            };
            graph.draw(options);

            $('#filter_relationships, #filter_definition').change(function () {
                var def = $('#filter_definition').val(),
                    rel = $('#filter_relationships').val();

                var filtered = {}
                filtered['nodes'] = [];
                filtered['links'] = data.links;

                var nodes = data.nodes;
                var links = data.links;

                for (var i = 0; i < nodes.length; i++) {
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

                /*for (var i = 0; i < links.length; i++) {
                    if (def.length > 0 && rel.length > 0 && (def == links[i]['def'] || rel == links[i]['rel'])) {
                        filtered['links'].push(links[i]);
                    }
                    if (def.length > 0 && rel.length == 0 && def == links[i]['def']) {
                        filtered['links'].push(links[i]);
                    }
                    if (def.length == 0 && rel.length > 0 && rel == links[i]['rel']) {
                        filtered['links'].push(links[i]);
                    }
                    if (def.length == 0 && rel.length == 0) {
                        filtered['links'].push(links[i]);
                    }
                }*/
                //console.log(filtered['links']);
                options['data'] = filtered;

                graph.draw(options);
            });
        }
    });
});

function filterLinks(links, nodes) {
    var filtered = [];
    var nodesIndexes = [];
    for (var i = 0; i < nodes.length; i++) {
        nodesIndexes.push(i);
    }

    for (var i = 0; i < links.length; i++) {
        if (inArray(links[i].target, nodesIndexes) || inArray(links[i].source, nodesIndexes)) {
            console.log(links[i]);
            filtered.push(links[i]);
        }
    }
    return filtered;
}

function inArray(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (item === arr[i]) {
            return true;
        }
    }
    return false;
}