class GraphService{
    private shortMonthNames: string[] = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec" ];
    private defaultConfig: BarLineConfig;
    private numberOfMonthsOnBarLineAnimated = 6;
    private htmlService: HtmlService = new HtmlService();
    private commonService: CommonService = new CommonService();

    replotBarLineAnimatedMonthly(id: string, expenses: Expense[], currency?: string){
        let series = this.getMonthlySeries(expenses);
        this.defaultConfig.currency = currency || '₪';
        let plot = this.barLineAnimated(id, series, series, this.defaultConfig);
        plot.replot({resetAxes:true});
    }

    replotPieChartsEnhancedLegend(id: string, expenses: Expense[]) {
        let series = [this.getExpenseTypeSeries(expenses)];
        let plot = jQuery.jqplot(id,
            series,
            {
                title: 'Statistics About Different Expenses',
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
            }
        );

        plot.replot({resetAxes:true});
    }

    private getChartData(expenses: Expense[], chartType: ChartType): any[] {
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

    private getExpenseTypeSeries(expenses: Expense[]): any[] {
        let series: any[] = [];
        let expensesTypesToatlPrices = this.getChartData(expenses, ChartType.ExpenseType);
        let ebumValues = this.commonService.getEnumValues(ExpenseType);
        let typeNames: string[] = this.htmlService.getExpensesTypeNames();

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

    private getMonthlySeries(expenses: Expense[]): any[] {
        let series: any[] = [];
        let currentMonth = (new Date()).getMonth();
        let monthsToatlPricesExpenses = this.getChartData(expenses, ChartType.Months);
        let monthToStartTheGraphWith = currentMonth - this.numberOfMonthsOnBarLineAnimated >= 0 ? currentMonth - this.numberOfMonthsOnBarLineAnimated : 0;
        this.defaultConfig = {xaxis:[], currency: ''};

        for(let i = monthToStartTheGraphWith; i < currentMonth + 1; i++) {
            if(monthsToatlPricesExpenses[i]) {
                series.push([i - monthToStartTheGraphWith, monthsToatlPricesExpenses[i]]);
            }
            else {
                series.push([i - monthToStartTheGraphWith, 0]);
            }

            this.defaultConfig.xaxis.push([i - monthToStartTheGraphWith, this.shortMonthNames[i]])
        }

        return series;
    }

    private barLineAnimated(id: string, s1: any[], s2: any[], config: BarLineConfig): any {
        var plot = $.jqplot(id, [s2, s1], {
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
                tooltipAxes: 'y',
                sizeAdjust: 7.5 , tooltipLocation : 'ne'
            }
        });

        return plot;
    }
}