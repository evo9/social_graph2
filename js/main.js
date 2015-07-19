$(document).ready(function () {
    $('#filter input[type="checkbox"]').each(function() {
        if ($(this).is(':checked')) {
            $(this).attr('checked', false);
        }
    });
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

            $('#filter input[type="checkbox"]').click(function() {
                var definitions = [];
                var relationships = [];
                $('#filter ul.relationships input[type="checkbox"]').each(function() {
                    if ($(this).is(':checked')) {
                        relationships.push($(this).val());
                    }
                });
                $('#filter ul.definitions input[type="checkbox"]').each(function() {
                    if ($(this).is(':checked')) {
                        definitions.push($(this).val());
                    }
                });

                var nodes = JSON.parse(JSON.stringify(data.nodes));
                var links = JSON.parse(JSON.stringify(data.links));

                if (relationships.length) {
                    options.data.links = filterRel(relationships, links);
                    options.data.nodes = getNodes(options.data.links, nodes)
                    options.data.links = getLinks(links, options.data.nodes);
                    console.log(options.data.links);
                }
                if (definitions.length > 0) {
                    options.data.nodes = filterDef(definitions, nodes)
                    options.data.links = getLinks(links, options.data.nodes);
                }
                if (relationships.length > 0 && definitions.length > 0) {
                    options.data.links = filterRel(relationships, links);
                    options.data.nodes = getNodes(options.data.links, nodes)
                    options.data.nodes = filterDef(definitions, options.data.nodes)
                    options.data.links = getLinks(links, options.data.nodes);
                }
                if (relationships.length == 0 && definitions.length == 0) {
                    options.data.nodes = nodes;
                    options.data.links = links;
                }

                graph.draw(options);
            });
        }
    });
});

function filterRel(rel, links) {
    var filtered = [];
    for (var i = 0; i < links.length; i ++) {
        if (inArray(links[i].rel, rel)) {
            filtered.push(links[i]);
        }
    }

    return filtered;
}

function filterDef(def, nodes) {
    var filtered = [];

    for (var i = 0; i < nodes.length; i ++) {
        if (inArray(nodes[i].def, def)) {
            filtered.push(nodes[i]);
        }
    }

    return filtered;
}

function getLinks(links, nodes) {
    var filtered = [];
    for (var j = 0; j < links.length; j ++) {
        var link = {};
        for (var i = 0; i < nodes.length; i ++) {
            if (links[j].source == nodes[i].index) {
                link['source'] = i;
            }
            if (links[j].target == nodes[i].index) {
                link['target'] = i;
            }
        }
        /*if (link.source || link.target) {
            console.log(Object.keys(link));
        }*/
        if (Object.keys(link).length == 2) {
            filtered.push(link);
        }
    }

    return filtered;
}

function getNodes(links, nodes) {
    var items = [],
        returns = []

    for (var i = 0; i < links.length; i ++) {
        if (!inArray(nodes[links[i].source].name, items)) {
            items.push(nodes[links[i].source].name);
            returns.push(nodes[links[i].source]);
        }
        if (!inArray(nodes[links[i].target].name, items)) {
            items.push(nodes[links[i].target].name);
            returns.push(nodes[links[i].target]);
        }
    }

    return returns;
}

function inArray(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (item === arr[i]) {
            return true;
        }
    }
    return false;
}