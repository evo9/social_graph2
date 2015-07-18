$(document).ready(function() {
    d3.json('excel_parser.php', function (error, data) {
        if (data) {
            var graph = new Graph({
                element: '#graph',
                data: data
            });
        }
    });
});