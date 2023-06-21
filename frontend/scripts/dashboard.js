let keywordsArray = location.href.split("=");
let kw = keywordsArray[1];
let positiveCount = 0;
let negativeCount = 0;
let neutralCount = 0;
let url = "";
if (kw === "datascience") {
  url = "http://127.0.0.1:7778/search/?url=https://www.coursera.org/learn/open-source-tools-for-data-science/reviews";
}



/* Tweet list render */
function listRender(request) {
  $("#datatable").DataTable({
    ajax: {
      url: request,
      dataSrc: "",
      crossDomain: true,
      dataType: "json",
      headers: {
        "ngrok-skip-browser-warning": "",
        "Access-Control-Allow-Origin": "*",
      },
    },
    columns: [
      { data: "Review" },
      { data: "Helpful For" },
      { data: "Rating" },
      {
        data: "sentiment",
        render: function (data, type) {
          //render different color for different sentiment
          if (type === "display") {
            let color = "blue";
            if (data === "positive") {
              color = "green";
            } else if (data === "negative") {
              color = "red";
            }
            return '<span style="color:' + color + '">' + data + "</span>";
          }
          return data;
        },
      },
    ],
    dom: "lfrtipB",
    buttons: [
      //csv files export
      {
        extend: "csv",
        text: "Export as CSV",
        exportOptions: {
          modifier: {
            search: "none",
          },
        },
      },
    ],
    bDestroy: true,
  });
}



/* pie charts render */
function pieChart(positiveD, negativeD, neutralD) {
  let myChart = echarts.init(document.getElementById("charts"));
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
      extraCssText: "width:175px;height:50px;",
    },
    series: [
      {
        type: "pie",
        data: [
          {
            value: positiveD,
            name: "Positive",
            itemStyle: { color: "#198754" },
          },
          {
            value: negativeD,
            name: "Negative",
            itemStyle: { color: "#dc3545" },
          },
          {
            value: neutralD,
            name: "Neutral",
            itemStyle: { color: "#0d6efd" }
          },
        ],
        label: {
          position: "outside",
          show: true,
          formatter: "{b}",
          color: "#ffffff",
          fontSize: 12,
        },
      },
    ],
  };
  myChart.setOption(option);
  // if (allowClick) {
  //   //for render specific sentiment
  //   myChart.on("click", function (params) {
  //     if (params.dataIndex === 0) {
  //       alert("Positive");
  //       listRenderSelect(url, "positive");
  //     } else if (params.dataIndex === 1) {
  //       alert("Negative");
  //       listRenderSelect(url, "negative");
  //     } else if (params.dataIndex === 2) {
  //       alert("Neutral");
  //       listRenderSelect(url, "neutral");
  //     }
  //   });
  // }
}
function barChart(positiveD, negativeD, neutralD) {
  let myChart = echarts.init(document.getElementById("charts"));
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      extraCssText: "width:175px;height:75px;"
    },
    xAxis: {
      type: 'category',
      data: ['Positive', 'Negative', 'Neutral'],
      axisTick: {
        alignWithLabel: true
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: [
          {
            value: positiveD,
            itemStyle: { color: "#198754" },
          },
          {
            value: negativeD,
            itemStyle: { color: "#dc3545" },
          },
          {
            value: neutralD,
            itemStyle: { color: "#0d6efd" }
          },
        ]
      }
    ]
  };
  myChart.setOption(option);
}


/* chart render with AJAX */
function chartInit(request) {
  $.ajax({
    url: request,
    dataType: "json",
    type: "get",
    headers: {
      "ngrok-skip-browser-warning": "",
      "Access-Control-Allow-Origin": "*",
    },
    success: function (data) {
      positiveCount = 0;
      negativeCount = 0;
      neutralCount = 0;
      $.each(data, function (i, item) {
        //count num from api source json
        switch (item["sentiment"]) {
          case "positive":
            positiveCount++;
            break;
          case "negative":
            negativeCount++;
            break;
          case "neutral":
            neutralCount++;
            break;
        }
      });
      pieChart(positiveCount, negativeCount, neutralCount);
    },
    error: function () {
      alert("Fail to load data!");
    },
  });
}



$(document).ready(function () {
  listRender(url);
  chartInit(url);
  $("#chartApply").click(function () {
    let type = $("#chartSelect").val();
    if (type === "piechart") {
      $("#charts").removeAttr("_echarts_instance_").empty();
      pieChart(positiveCount, negativeCount, neutralCount);
    }
    else if (type === "barchart") {
      $("#charts").removeAttr("_echarts_instance_").empty();
      barChart(positiveCount, negativeCount, neutralCount);
    }
  })
});
