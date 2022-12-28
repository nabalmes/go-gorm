
var content = 10;

//* Appending of select options for filtering
$("#filterby").on("input", function () {
  $("#status").empty().append(`<option value="0" selected="selected">Select Status</option>`)
  $("#type").empty().append(`<option value="0" selected="selected">Select Type</option>`)
  $("#select-tag").empty().append(`<option value="0" selected="selected">Select Tag</option>`)

  if (this.value == "courier") {
    //* Delivery
    $.get("/api/get_tag", function (t) {
      var tags = JSON.parse(t).tag
      $.each(tags, function (_, tag) {
        if (tag.Reassociation == 1) {
          $("#select-tag").append(`
            <option value="`+ tag.ID +`">`+ tag.MachineID +`</option>
          `)
        }
      })
    })

    $("#status").append(`
      <option value="1">Open</option>
      <option value="2">Closed</option>
    `)

  } else if (this.value == "maintenance") {
    //* Maintenance
    $.get("/api/get_tag", function (t) {
      var tags = JSON.parse(t).tag
      $.each(tags, function (_, tag) {
        if (tag.Reassociation == 2) {
          $("#select-tag").append(`
            <option value="`+ tag.ID +`">`+ tag.MachineID +`</option>
          `)
        }
      })
    })

    $("#status").append(`
      <option value="1">Open</option>
      <option value="2">Ongoing</option>
      <option value="3">Closed</option>
    `)

    $("#type").append(`
      <option value="1">Scheduled</option>
      <option value="2">Emergency</option>
    `)
  }
})

//* Get Delivery Data Length
function Page_Reports() {
  $("tbody").empty();
  $.ajax({
    url: "/api/reports",
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
      if (c > 0 && c < 1) {
        var i = b + 1;
        $("#nav-page").append(`
          <li class = "page-num" id="tbl-` + i + `">
            <button class="btn filter-btn__page" id="click"  onclick="Report(` + i + `)">` + i + `</button>
          </li>`
        );
      }
      console.log($('#nav-page').children().length)
      var pageCount = $('#nav-page').children().length;
      if (pageCount >= 5) {
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

  $.get("/api/reports", function (index, response) {
    $.each(JSON.parse(index).reports, function (k, v) {
      if (k >= start - 1 && k <= end - 1) {
        AppendReport(v.ID, v.CreatedAt, v.Tag.MachineID, v.Category, v.Location, v.Status, v.Type, v.TimeStamp, v.TimeStart, v.TimeEnd, v.Duration);
      }
    });
  });
}

//* Call Append Report Function
function AppendReport(id, create, code, category, location, status, type, timestamp, start, end, duration) {
  // let today = moment(new Date(create)).format("MM/DD/YYYY");
  
  $(".tbl-content__design").append(`
    <tr>
      <td>` + create + `</td>
      <td>` + code + `</td>
      <td>` + category + `</td>
      <td>` + location.Name + `</td>
      <td>` + location.Address + `</td>
      <td>` + status + `</td>
      <td class="view-details content-` + id + `"> View Details </td>
    </tr>
  `);

  var viewDetails = document.querySelectorAll(".content-"+id)
  var viewModal = document.querySelector(".view-modal")
  viewDetails.forEach(function (e) {
    e.addEventListener("click", function () {
      viewModal.classList.add("shows")

      if (category == "Courier") {
        $(".card-details").empty().append(`
        <div class="description-name-details card-detail">
            <h5>Date:</h5>
            <h4 class="view-created">` + create + `</h4>
        </div>

        <div class="tag-id-details card-detail">
          <h5>Tag ID:</h5>
          <h4 class="view-tag">`+ code +`</h4>
        </div>
        
        <div class="category-name-details card-detail">
            <h5>Category:</h5>
            <h4 class="view-category">`+ category +`</h4>
        </div>

        <div class="type-name-details card-detail">
            <h5>Status:</h5>
            <h4 class="view-type">` + status + `</h4>
        </div>

        <div class="timestamp-details card-detail">
            <h5>Time Stamp:</h5>
            <h4 class="view-type">` + timestamp + `</h4>
        </div>

        <div class="code-name-details card-detail">
            <h5>Name:</h5>
            <h4 class="view-name">`+ location.Name +`</h4>
        </div>

        <div class="address-name-details card-detail">
            <h5>Address:</h5>
            <h4 class="view-description">`+ location.Address +`</h4>
        </div>
      `)
      }


      if (category == "Maintenance"){
      $(".card-details").empty().append(`
          <div class="description-name-details card-detail">
              <h5>Date:</h5>
              <h4 class="view-created">` + create + `</h4>
          </div>

          <div class="tag-id-details card-detail">
            <h5>Tag ID:</h5>
            <h4 class="view-tag">`+ code +`</h4>
          </div>

          <div class="category-name-details card-detail">
            <h5>Category:</h5>
            <h4 class="view-category">`+ category +`</h4>
          </div>

          <div class="type-name-details card-detail">
              <h5>Type:</h5>
              <h4 class="view-type">` + type + `</h4>
          </div>

          <div class="status-name-details card-detail">
              <h5>Status:</h5>
              <h4 class="view-type">` + status + `</h4>
          </div>

          <div class="timestart-details card-detail">
              <h5>Time Start:</h5>
              <h4 class="view-type">` + start + `</h4>
          </div>

          <div class="timeend-details card-detail">
              <h5>Time End:</h5>
              <h4 class="view-type">` + end + `</h4>
          </div>
          
          <div class="duration-details card-detail">
              <h5>Duration:</h5>
              <h4 class="view-type">` + duration + `</h4>
          </div>

          <div class="code-name-details card-detail">
              <h5>Name:</h5>
              <h4 class="view-name">`+ location.Name +`</h4>
          </div>
          
          <div class="description-name-details card-detail">
              <h5>Description:</h5>
              <h4 class="view-description">`+ location.Description +`</h4>
          </div>

          <div class="address-name-details card-detail">
              <h5>Address:</h5>
              <h4 class="view-description">`+ location.Address +`</h4>
          </div>
        `)
    }
    })
  })

  viewModal.addEventListener("click", function () {
    var target = $(event.target);
    if (target.is(".view-modal")) {
      target.removeClass('shows');
    }
  })

}

//* Filtering of data using search and data length
function ApplyFilter() {
  var filterby = $("#filterby").val()
  var tag = $("#select-tag").val()
  var status = $("#status").val()
  var type = $("#type").val()
  var date_from = $("#date_from").val()
  var date = $("#date_to").val()
  let date_to = moment(new Date(date)).add(1, "d").format("YYYY-MM-DD");
  
  $.ajax({
    url: "/api/reports",
    data: {
      "filterby": filterby,
      "tag": tag,
      "status": status,
      "type": type,
      "date_from": date_from,
      "date_to": date_to,
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
      if (c > 0 && c < 1) {
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
  var filterby = $("#filterby").val()
  var tag = $("#select-tag").val()
  var status = $("#status").val()
  var type = $("#type").val()
  var date_from = $("#date_from").val()
  var date = $("#date_to").val()
  let date_to = moment(new Date(date)).add(1, "d").format("YYYY-MM-DD");

  $.ajax({
    url: "/api/reports",
    data: {
      "filterby": filterby,
      "tag": tag,
      "status": status,
      "type": type,
      "date_from": date_from,
      "date_to": date_to,
    },
    success: function (res) {
      $("tbody").empty();
      var value = JSON.parse(res);
      var reports = value["reports"];
      var end = content * parseInt(i);
      var start = end - (content - 1);
      $.each(reports, function (k, v) {
        if (k >= start - 1 && k <= end - 1) {
          AppendReport(v.ID, v.CreatedAt, v.Tag.MachineID, v.Category, v.Location, v.Status, v.Type, v.TimeStamp, v.TimeStart, v.TimeEnd, v.Duration);
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


$(document).ready(function () {
  $(".dropdown-items").click(function () {
    $(this).find(".dropdown-content__items").addClass("show");
  });
});
$(document).on("click", function (event) {
  var $trigger = $(".dropdown-items");
  if ($trigger !== event.target && !$trigger.has(event.target).length) {
    $(".dropdown-content__items").removeClass('show')
  }
});

$('#filterby').change(function () {
  var tagID = $('#filterby').val()
  $('.dashboard-filter__date').addClass('show')
  if (tagID == '' || tagID == ' ') {
    $('.dashboard-filter__date').removeClass('show')
  }
});




