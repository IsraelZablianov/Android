var GraphService = (function () {
    function GraphService() {
        this.shortMonthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"];
        this.numberOfMonthsOnBarLineAnimated = 6;
        this.htmlService = new HtmlService();
        this.commonService = new CommonService();
    }
    GraphService.prototype.replotBarLineAnimatedMonthly = function (id, expenses, currency) {
        if (this.barLinePlot) {
            this.barLinePlot.destroy();
        }
        var series = this.getMonthlySeries(expenses);
        this.defaultConfig.currency = currency || '₪';
        this.barLinePlot = this.createBarLineAnimated(id, series, series, this.defaultConfig);
        this.barLinePlot.replot({ resetAxes: true });
    };
    GraphService.prototype.replotPieChartsEnhancedLegend = function (id, expenses) {
        if (this.pieChartPlot) {
            this.pieChartPlot.destroy();
        }
        var series = [this.getExpenseTypeSeries(expenses)];
        this.pieChartPlot = this.createPieChart(id, series);
        this.pieChartPlot.replot({ resetAxes: true });
    };
    GraphService.prototype.getChartData = function (expenses, chartType) {
        var currentYear = (new Date()).getFullYear();
        var values = {};
        expenses.forEach(function (expense) {
            var index = chartType === ChartType.ExpenseType ? Number(expense.expenseType) : Number(expense.date.getMonth());
            if (currentYear === Number(expense.date.getFullYear())) {
                if (values[index] === undefined) {
                    values[index] = Number(expense.price);
                }
                else {
                    values[index] = Number(values[index]) + Number(expense.price);
                }
            }
        });
        return values;
    };
    GraphService.prototype.getExpenseTypeSeries = function (expenses) {
        var series = [];
        var expensesTypesToatlPrices = this.getChartData(expenses, ChartType.ExpenseType);
        var ebumValues = this.commonService.getEnumValues(ExpenseType);
        var typeNames = this.htmlService.getExpensesTypeNames();
        $.each(ebumValues, function (index, expenseType) {
            if (expensesTypesToatlPrices[expenseType] !== undefined) {
                series.push([typeNames[expenseType], expensesTypesToatlPrices[expenseType]]);
            }
            else {
                series.push([typeNames[expenseType], 0]);
            }
        });
        return series;
    };
    GraphService.prototype.getMonthlySeries = function (expenses) {
        var series = [];
        var currentMonth = (new Date()).getMonth();
        var monthsToatlPricesExpenses = this.getChartData(expenses, ChartType.Months);
        var monthToStartTheGraphWith = currentMonth - this.numberOfMonthsOnBarLineAnimated >= 0 ? currentMonth - this.numberOfMonthsOnBarLineAnimated : 0;
        this.defaultConfig = { xaxis: [], currency: '' };
        for (var i = monthToStartTheGraphWith; i < currentMonth + 1; i++) {
            if (monthsToatlPricesExpenses[i]) {
                series.push([i - monthToStartTheGraphWith, monthsToatlPricesExpenses[i]]);
            }
            else {
                series.push([i - monthToStartTheGraphWith, 0]);
            }
            this.defaultConfig.xaxis.push([i - monthToStartTheGraphWith, this.shortMonthNames[i]]);
        }
        return series;
    };
    GraphService.prototype.createPieChart = function (id, series) {
        return $.jqplot(id, series, {
            title: 'Statistics Depending On The Selected Date',
            seriesDefaults: {
                shadow: false,
                renderer: jQuery.jqplot.PieRenderer,
                rendererOptions: { padding: 2, sliceMargin: 2, showDataLabels: true }
            },
            legend: {
                show: true,
                location: 'e',
                renderer: $.jqplot.EnhancedPieLegendRenderer,
                rendererOptions: {
                    numberColumns: 1,
                }
            },
            markerRenderer: {
                color: '#fff',
            }
        });
    };
    GraphService.prototype.createBarLineAnimated = function (id, s1, s2, config) {
        return $.jqplot(id, [s2, s1], {
            // Turns on animatino for all series in this plot.
            animate: true,
            // Will animate plot on calls to plot1.replot({resetAxes:true})
            animateReplot: true,
            title: 'Statistics About Yearly Expenses',
            cursor: {
                show: true,
                zoom: true,
                looseZoom: true,
                showTooltip: false
            },
            seriesDefaults: {
                pointLabels: { show: false },
                shadow: false,
                rendererOptions: {
                    barPadding: 0,
                    barMargin: 10,
                    barWidth: 25
                }
            },
            series: [
                {
                    pointLabels: {
                        show: true,
                        formatString: config.currency + " %'d"
                    },
                    renderer: $.jqplot.BarRenderer,
                    showHighlight: false,
                    yaxis: 'y2axis',
                    rendererOptions: {
                        // Speed up the animation a little bit.
                        // This is a number of milliseconds.
                        // Default for bar series is 3000.
                        animation: {
                            speed: 2500
                        },
                        barWidth: 15,
                        barPadding: 15,
                        barMargin: 5,
                        highlightMouseOver: false
                    }
                },
                {
                    rendererOptions: {
                        // speed up the animation a little bit.
                        // This is a number of milliseconds.
                        // Default for a line series is 2500.
                        animation: {
                            speed: 2000
                        }
                    }
                }
            ],
            axesDefaults: {
                pad: 0
            },
            axes: {
                // These options will set up the x axis like a category axis.
                xaxis: {
                    ticks: config.xaxis,
                    tickInterval: 1,
                    drawMajorGridlines: false,
                    drawMinorGridlines: true,
                    drawMajorTickMarks: false,
                    rendererOptions: {
                        tickInset: 0.5,
                        minorTicks: 1
                    }
                },
                yaxis: {
                    pointLabels: {
                        show: true
                    },
                    tickOptions: {
                        formatString: config.currency + " %'d"
                    },
                    rendererOptions: {
                        forceTickAt0: true
                    }
                },
                y2axis: {
                    tickOptions: {
                        showGridline: false,
                        showMark: true,
                        show: false
                    }
                }
            },
            highlighter: {
                show: true,
                showLabel: true,
                tooltipAxes: 'y',
                sizeAdjust: 7.5, tooltipLocation: 'ne'
            }
        });
    };
    return GraphService;
}());
//# sourceMappingURL=graph-service.js.map