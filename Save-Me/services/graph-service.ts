/*
* This class service is responsible for statistics page
* Graph displaying.
* */

class GraphService {
    private defaultConfig: BarLineConfig;
    private numberOfMonthsOnBarLineAnimated: number = 6;
    private commonService: CommonService = new CommonService();
    private barLinePlot: any;
    private pieChartPlot: any;

    /*
    * The replot method, builds the graph again and destroys the old one.
    * */
    replotBarLineAnimatedMonthly(id: string, expenses: Expense[], currency?: string): void {
        if(this.barLinePlot){
            this.barLinePlot.destroy();
        }

        let series = this.getMonthlySeries(expenses);
        this.defaultConfig.currency = currency || '₪';
        this.barLinePlot = this.createBarLineAnimated(id, series, series, this.defaultConfig);
        this.barLinePlot.replot({resetAxes:true});
    }

    /*
     * The replot method, builds the graph again and destroys the old one.
     * */
    replotPieChartsEnhancedLegend(id: string, expenses: Expense[]): void {
        if(this.pieChartPlot){
            this.pieChartPlot.destroy();
        }

        let series = [this.getExpenseTypeSeries(expenses)];
        this.pieChartPlot = this.createPieChart(id, series);
        this.pieChartPlot.replot({resetAxes:true});
    }

    /*
    * Returns A key value pair ( simple object that been used like a map).
    * The keys can be months, expense type or any of the ChartType enum,
    * The value is the sum of those expenses.
    * */
    private getChartDataMap(expenses: Expense[], chartType: ChartType): any {
        let currentYear = (new Date()).getFullYear();
        let values: any = {};

        expenses.forEach((expense) => {
            let index: number = chartType === ChartType.ExpenseType ? Number(expense.expenseType) : Number(expense.date.getMonth());
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
    }

    /*
    * Returns a series, build according to jqPlot requirements For 'Bar Line Animated' chart.
    * */
    private getExpenseTypeSeries(expenses: Expense[]): any[] {
        let series: any[] = [];
        let expensesTypesToatlPrices = this.getChartDataMap(expenses, ChartType.ExpenseType);
        let ebumValues = this.commonService.getEnumNumericKeys(ExpenseType);
        let typeNames: string[] = this.commonService.getExpenseTypeNames();

        $.each(ebumValues, (index, expenseType)=> {
            if(expensesTypesToatlPrices[expenseType] !== undefined){
                series.push([typeNames[expenseType], expensesTypesToatlPrices[expenseType]])
            }
            else {
                series.push([typeNames[expenseType], 0])
            }
        });

        return series;
    }

    /*
    * Returns a series, build according to jqPlot requirements For 'Pie Charts Enhanced Legend' chart.
    * */
    private getMonthlySeries(expenses: Expense[]): any[] {
        let series: any[] = [];
        let currentMonth = (new Date()).getMonth();
        let monthsToatlPricesExpenses = this.getChartDataMap(expenses, ChartType.Months);
        let monthToStartTheGraphWith = currentMonth - this.numberOfMonthsOnBarLineAnimated >= 0 ? currentMonth - this.numberOfMonthsOnBarLineAnimated : 0;
        this.defaultConfig = {xaxis:[], currency: ''};

        for(let i = monthToStartTheGraphWith; i < currentMonth + 1; i++) {
            if(monthsToatlPricesExpenses[i]) {
                series.push([i - monthToStartTheGraphWith, monthsToatlPricesExpenses[i]]);
            }
            else {
                series.push([i - monthToStartTheGraphWith, 0]);
            }

            this.defaultConfig.xaxis.push([i - monthToStartTheGraphWith, this.commonService.getshortMonthNames()[i]])
        }

        return series;
    }


    /*
    * Basic configuration for creating Plot objects From jqPlot library.
    * For more info visit ->  http://www.jqplot.com/examples/
    * */
    private createPieChart(id: string, series: any[][]): any {
        return $.jqplot(id,
            series,
            {
                title: 'Statistics Depending On The Selected Date',
                seriesDefaults: {
                    shadow: false,
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {padding: 2, sliceMargin: 2, showDataLabels: true}
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
            }
        );
    }

    private createBarLineAnimated(id: string, s1: any[], s2: any[], config: BarLineConfig): any {
        return $.jqplot(id, [s2, s1], {
            // Turns on animatino for all series in this plot.
            animate: true,
            // Will animate plot on calls to plot1.replot({resetAxes:true})
            animateReplot: true,
            title: "Statistics About Yearly Expenses",
            cursor: {
                show: true,
                zoom: true,
                looseZoom: true,
                showTooltip: false
            },
            seriesDefaults:{
                pointLabels:{show:false},
                shadow: false,
                rendererOptions:{
                    barPadding: 0,
                    barMargin: 10,
                    barWidth: 25
                }
            },
            series:[
                {
                    pointLabels: {
                         show:true,
                        formatString: config.currency + " %'d"
                    },
                    renderer: $.jqplot.BarRenderer,
                    showHighlight: false,
                    yaxis: "y2axis",
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
                    pointLabels:{
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
                tooltipAxes: "y",
                sizeAdjust: 7.5 , tooltipLocation : "ne"
            }
        });
    }
}