(function () {
    var defaultOptions = {
        element: null,
        data: [],
        width: 960,
        height: 600
    };

    function defaults(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] == null) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }

    /*** Graph functions ***/

    function Graph() {
    }

    Graph.prototype.draw = function(options) {
        this.options = defaults(options, defaultOptions);
        var self = this;
        var options = self.options;
        var graph = options.data

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(100)
            .size([options.width, options.height]);

        var svg = d3.select(options.element).append('svg')
            .attr('width', options.width)
            .attr('height', options.height);

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .style("stroke", function (d) {
                var nodes = graph.nodes;
                var index = d.source.index;
                return color(nodes[index].group);
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        node.append("title")
            .text(function(d) { return d.name; });

        force.on("tick", function() {
            link.attr("x1", function(d) {
                return d.source.x;
            })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node.attr("cx", function(d) {
                return d.x;
            })
                .attr("cy", function(d) {
                    return d.y;
                });
        });

        /*d3.selectAll("circle")
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        d3.selectAll("text")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });*/
    }

    if (typeof define === "function" && define.amd) {
        define("graph", function (require) {
            return Graph;
        });
    }
    else {
        window.Graph = window.Graph = Graph;
    }
})();
/*
var Graph = {
    load:
    draw: function(element, data, options) {
        var defaultOptions = {
            width: 960,
            height: 600
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    defaultOptions[i] = options[i];
                }
            }
        }


    }
};*/
