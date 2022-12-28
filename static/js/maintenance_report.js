var content = 10;
//* Get Delivery Data Length
function Page_Reports() {
  $("tbody").empty();
  $.ajax({
    url: "/api/maintenance_report",
    data: {
      "search": 0,
    },
    success: function (res) {
      $("#nav-page").empty();
      var value = JSON.parse(res);
      var orderlength = value["length"];
      var result = orderlength / content;
      var a = 0;

      for (var i = 1; i <= result; i++) {
        var b = a + i;
        $("#nav-page").append(`
		  	  <li class = "page-num" id="tbl-` + i + `">
            <button class="btn filter-btn__page" id="click"  onclick="Report(`+ i + `)"> ` + i + `</button>
          </li>`
        );
      }

      var c = result - b;
      if (c < 1) {
        var i = b + 1;
        $("#nav-page").append(`
          <li class = "page-num" id="tbl-` + i + `">
            <button class="btn filter-btn__page" id="click"  onclick="Report(` + i + `)">` + i + `</button>
          </li>`
        );
      }
      console.log($('#nav-page').children().length)
      var pageCount = $('#nav-page').children().length;
      if(pageCount >= 5){
        $("#scrollpageLeft .chevron").fadeIn();
      }
    },
  });
}

//* Appending of Data Pagination
function Report(i) {
  $("tbody").empty();
  var end = content * parseInt(i);
  var start = end - (content - 1);

  $.get("/api/maintenance_report", function (index, response) {
    $.each(JSON.parse(index).maintenance, function (k, v) {
      if (k >= start - 1 && k <= end - 1) {
        AppendReport(v.CreatedAt, v.Location.Code, v.Location.Name, v.Location.Description, v.Location.Address, v.Status, v.Type);
      }
    });
  });
}

//* Call Append Report Function
function AppendReport(create, code, name, desc, address, stat, type) {
  let today = moment(new Date(create)).format("MM/DD/YYYY");
  let status = ""
  let Type = ""

  if (stat == 1) {
    status = "Open";
  } else if (stat == 2) {
    status = "Ongoing";
  } else {
    status = "Closed"
  }

  if (type == 1) {
    Type = "Scheduled";
  } else {
    Type = "Emergency"
  }

  $(".tbl-content__design").append(
    `<tr>
      <td>` + today + `</td>
      <td>` + code + `</td>
      <td>` + name + `</td>
      <td>` + desc + `</td>
      <td>` + address + `</td>
      <td>` + status + `</td>
      <td>` + Type + `</td>
    </tr>
  `);
}

//* Filtering of data using search and data length
function Search() {
  var code = $("#filter_name").val()
  var status = $("#status").val()
  var type = $("#type").val()

  $.ajax({
    url: "/api/delivery_report",
    data: {
      "code": code,
      "status": status,
      "type": type,
    },
    success: function (res) {
      $("#nav-page").empty();
      var value = JSON.parse(res);
      var orderlength = value["length"];
      var result = orderlength / content;
      var a = 0;
      for (var i = 1; i <= result; i++) {
        var b = a + i;
        $("#nav-page").append(`
		  	  <li class = "mx-1 d-flex align-items-center" id="tbl-` + i + `">
            <button class="btn filter-btn__page" id="click"  onclick="Filter(`+ i + `)"> ` + i + `</button>
          </li>`
        );
      }
      var c = result - b;
      if (c < 1) {
        var i = b + 1;
        $("#nav-page").append(`
          <li class = "mx-1 d-flex align-items-center" id="tbl-` + i + `">
            <button class="btn filter-btn__page" id="click"  onclick="Filter(` + i + `)">` + i + `</button>
          </li>`
        );
      }
    },
  });

  Filter(1)
}

//* Appending of data in Search Result
function Filter(i) {
  var code = $("#filter_name").val()
  var status = $("#status").val()
  var type = $("#type").val()

  $.ajax({
    url: "/api/maintenance_report",
    data: {
      "code": code,
      "status": status,
      "type": type,
    },
    success: function (res) {
      $("tbody").empty();
      var value = JSON.parse(res);
      var maintenance = value["maintenance"];
      var end = content * parseInt(i);
      var start = end - (content - 1);
      $.each(maintenance, function (k, v) {
        if (k >= start - 1 && k <= end - 1) {
          AppendReport(v.CreatedAt, v.Location.Code, v.Location.Name, v.Location.Description, v.Location.Address, v.Status, v.Type);
        }
      });
    }
  })
}



$(".page-item").on("click", "button", function () {
  $(".page-item button.actives").removeClass("actives");
  $(this).addClass("actives");
});

// *Pagination Scroll
$(document).ready(function () {
  var scrollNav = document.getElementById("nav-page");
  var scrollLocation = $("#nav-page").scrollLeft();
  if (scrollLocation == 0) {
    $("#scrollpageRight .chevron").fadeOut();
    $("#scrollpageLeft .chevron").fadeOut();
  }
  $("#scrollpageLeft").click(function () {
    var scrollLocationleft = (document.getElementById(
      "nav-page"
    ).scrollLeft += 200);
    document.getElementById("nav-page").scrollLeft += 200;

    if (scrollLocationleft > 0) {
      $("#scrollpageRight .chevron").fadeIn();
    }
  });
  $("#scrollpageRight").click(function () {
    var scrollLocationright = (document.getElementById("nav-page").scrollLeft -= 200);
    document.getElementById("nav-page").scrollLeft -= 200;
    var scrollLoc = $("#nav-page").scrollLeft();
    if (scrollLoc <= 200) {
      $("#scrollpageRight .chevron").fadeOut();
      $("#nav-page").css("max-width", "167px");
    }
  });
  $("#nav-page").on("scroll", function () {
    if ($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
      $("#scrollpageLeft .chevron").fadeOut();
    } else {
      $("#scrollpageLeft .chevron").fadeIn();
    }
  });
});
