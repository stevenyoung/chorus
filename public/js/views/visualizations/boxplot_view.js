chorus.views.visualizations.BoxplotGamma = chorus.views.Base.extend({
    render: function() {
        var $el = $(this.el);
        $el.html("");
        $el.addClass("visualization");

        var xLabelHeight = 8;
        var yLabelWidth = 18;
        var data = new chorus.presenters.visualizations.Boxplot(this.model, {
            x: this.options.x,
            y: this.options.y
        }).present();

        var chart = d3.select(this.el).append("svg").
            attr("class", "chart box_plot").
            attr("viewBox", "0 0 272 100").
            append("g").
            attr("class", "top_transform");

        var xPaddedScaler = d3.scale.ordinal().
            domain(_.pluck(data, "bucket")).
            rangeBands([yLabelWidth + 2, 270]);

        var xEdgeScaler = d3.scale.ordinal().
            domain(_.pluck(data, "bucket")).
            rangeBands([yLabelWidth, 272]);

        var yPaddedScaler = d3.scale.linear().
            domain([data.minY, data.maxY]).
            range([98 - xLabelHeight, 2]);

        var yEdgeScaler = d3.scale.linear().
            domain([data.minY, data.maxY]).
            range([100 - xLabelHeight, 0]);

        chart.selectAll("line.ytick").data(yPaddedScaler.ticks(10)).enter().
            append("line").
            attr("class", "ytick").
            attr("y1", yPaddedScaler).
            attr("y2", yPaddedScaler).
            attr("x1", xPaddedScaler.rangeExtent()[0]).
            attr("x2", xPaddedScaler.rangeExtent()[1]);

        chart.selectAll("text.ytick_label").data(yPaddedScaler.ticks(10)).enter().
            append("text").attr("class", "ytick_label").
            text(String).
            attr("text-anchor", "end").
            attr("x", yLabelWidth - 3).
            attr("y", yPaddedScaler);

        var boxes = chart.selectAll("g.box").data(data).enter().
            append("g").
            attr("class", "box");

        var boxWidth = xPaddedScaler.rangeBand() * 0.2;
        var boxOffset = xPaddedScaler.rangeBand() * 0.4;

        boxes.append("line").
            attr("class", "whisker vertical").
            attr("x1",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.5 * boxWidth
            }).
            attr("x2",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.5 * boxWidth
            }).
            attr("y1",
            function(d) {
                return yPaddedScaler(d.min)
            }).
            attr("y2", function(d) {
                return yPaddedScaler(d.max)
            });

        boxes.append("line").
            attr("class", "whisker horizontal top").
            attr("x1",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.25 * boxWidth
            }).
            attr("x2",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.75 * boxWidth
            }).
            attr("y1",
            function(d) {
                return yPaddedScaler(d.max)
            }).
            attr("y2", function(d) {
                return yPaddedScaler(d.max)
            });

        boxes.append("line").
            attr("class", "whisker horizontal bottom").
            attr("x1",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.25 * boxWidth
            }).
            attr("x2",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + 0.75 * boxWidth
            }).
            attr("y1",
            function(d) {
                return yPaddedScaler(d.min)
            }).
            attr("y2", function(d) {
                return yPaddedScaler(d.min)
            });

        boxes.append("rect").
            attr("width", boxWidth).
            attr("height",
            function(d) {
                return Math.abs(yPaddedScaler(d.thirdQuartile) - yPaddedScaler(d.firstQuartile))
            }).
            attr("x",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset
            }).
            attr("y",
            function(d) {
                return yPaddedScaler(d.thirdQuartile)
            }).
            attr("bucket", function(d) {
                return d.bucket
            });

        boxes.append("line").
            attr("class", "median").
            attr("x1",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset
            }).
            attr("x2",
            function(d) {
                return xPaddedScaler(d.bucket) + boxOffset + boxWidth
            }).
            attr("y1",
            function(d) {
                return yPaddedScaler(d.median)
            }).
            attr("y2", function(d) {
                return yPaddedScaler(d.median)
            });

        chart.append("line").
            attr("class", "yaxis").
            attr("x1", xEdgeScaler.rangeExtent()[0]).
            attr("x2", xEdgeScaler.rangeExtent()[0]).
            attr("y1", yEdgeScaler.range()[0]).
            attr("y2", yEdgeScaler.range()[1]);
        chart.append("line").
            attr("class", "xaxis").
            attr("x1", xEdgeScaler.rangeExtent()[0]).
            attr("x2", xEdgeScaler.rangeExtent()[1]).
            attr("y1", yEdgeScaler.range()[0]).
            attr("y2", yEdgeScaler.range()[0]);


        return this;
    }
});

chorus.views.visualizations.Boxplot = chorus.views.Base.extend({
    render: function() {
        var $el = $(this.el);
        $el.addClass("visualization");
        var data = new chorus.presenters.visualizations.Boxplot(this.model).present();
        chorus.chart.boxplot(
            this.chartArea(this.el),
            data,
            {xAxisTitle: this.model.get("chart[xAxis]"),
             yAxisTitle: this.model.get("chart[yAxis]")}
        );
        this.postRender();
    },

    chartArea : function(el) {
        this.plotWidth = 925;
        this.plotHeight = 340;

        return d3.select(el)
            .append("svg:svg")
            .attr("class", "chart")
            .attr("width", this.plotWidth)
            .attr("height", this.plotHeight)
            .append("svg:g")
            .attr("class", "plot")
            .attr("width", this.plotWidth)
            .attr("height", this.plotHeight);
    }
});

