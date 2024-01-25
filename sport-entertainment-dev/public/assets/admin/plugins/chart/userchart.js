$(document).ready(function () {
    var userBarChartUrl = "register-users-chart";
    var userPieChartUrl = "active-deactive-users-chart";

    $('input[name="registercustomdates"]').daterangepicker({
        maxDate: new Date(),
    });
    $('input[name="registercustomdates"]').on("change", function () {
        var customDate = $(this).val();
        var dates = customDate.split(" - ");
        var startDate = dates[0];
        var endDate = dates[1];
        var filterBy = "custom";
        updateUserBarChart(filterBy, startDate, endDate);
    });

    var userBarOptions = {
        chart: {
            id: "registerUser",
            type: "bar",
            height: "300px",
        },
        series: [
            {
                name: "register users",
                data: [],
            },
        ],
        xaxis: {
            categories: [],
            // tickPlacement: 'on'
        },
        plotOptions: {
            bar: {
                // endingShape: "rounded",
                dataLabels: {
                    position: "bottom",
                },
            },
        },
    };

    var userPieOptions = {
        series: [],
        chart: {
            width: "100%",
            type: "pie",
        },
        legend: {
            position: "bottom",
        },
        labels: [],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    var userBarChart = new ApexCharts(
        document.querySelector("#register-user-chart"),
        userBarOptions
    );
    var userPieChart = new ApexCharts(
        document.querySelector("#user-active-pie-chart"),
        userPieOptions
    );
    userBarChart.render();
    userPieChart.render();

    $("#horizontalSwitch").on("click", function () {
        let switchValue = false;
        let height = "350px";
        if ($(this).prop("checked") == true) {
            switchValue = true;
            height = "350px";
        }

        userBarChart.updateOptions({
            chart: {
                height: height,
            },
            plotOptions: {
                bar: {
                    horizontal: switchValue,
                },
            },
        });
    });

    var updateUserBarChart = function (
        filterBy = "week",
        startDate = "",
        endDate = ""
    ) {
        $.ajax({
            url: userBarChartUrl,
            type: "GET",
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                filterBy: filterBy,
                startDate: startDate,
                endDate: endDate,
            },
            success: function (data) {
                var horizontalSwitch = false;
                if ($("#horizontalSwitch").prop("checked") == true) {
                    horizontalSwitch = true;
                }
                userBarChart.updateOptions({
                    series: [
                        {
                            name: "register users",
                            data: data.data,
                        },
                    ],
                    xaxis: {
                        categories: data.labels,
                    },
                    fill: {
                        colors: ["#1E1E2D"],
                    },
                    plotOptions: {
                        bar: {
                            horizontal: horizontalSwitch,
                        },
                    },
                });
            },
            error: function (data) {
                console.log(data);
            },
        });
    };

    var updateUserPieChart = function () {
        $.ajax({
            url: userPieChartUrl,
            type: "GET",
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {},
            success: function (data) {
                $("#active_user_count").text(data.data[0]);
                $("#deactive_user_count").text(data.data[1]);
                userPieChart.updateOptions({
                    labels: data.labels,
                    series: data.data,
                    colors: ["rgb(0, 183, 70)", "rgb(239, 64, 60)"],
                });
            },
            error: function (data) {
                console.log(data);
            },
        });
    };

    $("#registerUserChart").on("change", function () {
        var filterBy = $(this).val();
        if (filterBy != "custom") {
            $(".register-user-date").hide();
            updateUserBarChart(filterBy);
        } else {
            $(".register-user-date").show();
        }
    });

    updateUserBarChart();
    updateUserPieChart();
});
