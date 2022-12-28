var tagBtn = document.querySelector(".add-tag__btn");
var dashboardModal = document.querySelector(".tag-add__modal");
var modalContainer = document.querySelector(".tag-modal__container");
var cancelBtn = document.querySelector("#tag-cancel");

function  createTag(){
  dashboardModal.classList.add('show');
  modalContainer.classList.add('show');
  $("#tag-save").attr("data-action", "save-tag")
  $("#timezone").empty()

  $(".employee-input").val("");
  $(".tag-header").html("Create Tag")
  $(".tag-header__desc").html("Fill out the form below to add.")
  $(".editing-img").css("display", "none")
  $("#machineID").css("pointer-events", "all").css("opacity", "1")

  $.get("/admin/api/d/timezone/read", function(index){
    var result = JSON.parse(index).result
    $("#timezone").append(`
      <option value="">Select time zone</option>
    `)

    $.each(result, function(_,tz){
      $("#timezone").append(`
        <option value="`+ tz.ID +`">`+ tz.Name +`</option>
      `)
    })
  })

  $("[data-action='save-tag']").on("click", function () {
    if ($("#machineID").val() != "" && $("#name").val() != "" && $("#description").val() != "" &&
      $("#address").val() != "" && $("longitude").val() != "" &&
      $("#latitude").val() != "" && $("#timezone").val() != ""){

      $.ajax({
        url: "/api/add_tag",
        data: {
          "uid": $("#machineID").val(),
          "code": $("#code").val(),
          "name": $("#name").val(),
          "description": $("#description").val(),
          "type": $("#maintenance-type").val(),
          "address": $("#address").val(),
          "longitude": $("#longitude").val(),
          "latitude": $("#latitude").val(),
          "timezone": $("#timezone").val(),
          "type": $("#tag_type").val(),
          // "country": $("#country").val(),
        },
        success: function () {
          $(".tag-add__modal").removeClass("show");
          $(".tag-modal__container").css("transition", "transform 550ms ease-in-out");
          $(".tag-modal__container").removeClass("show");
          window.location.reload()
        },
      });
    } else {
      
      $("input").each(function (i, v) {
        if ($(v).attr("required") == "required" && $(v).val() == "") {
          $(v).next().css("display", "block")
          
          if($("textarea").val() == ""){
            $("textarea").next().css("display", "block")
          }
          if ($("select").val() == "") {
            $("select").next().css("display", "block")
          }
  
        } else {
          $(v).next().css("display", "none")
  
          if($("textarea").val() != ""){
            $("textarea").next().css("display", "none")
          }
          if ($("select").val() != "") {
            $("select").next().css("display", "none")
          }
        }
      })
  
    }
  });
  
}

cancelBtn.addEventListener('click', function () {
  dashboardModal.classList.remove('show');
  modalContainer.style.transition = "transform 550ms ease-in-out";
  modalContainer.classList.remove('show');
})




function editTag(id){
  localStorage.setItem("tag_id",id)
  dashboardModal.classList.add('show');
  modalContainer.classList.add('show');
  $("#tag-save").attr("data-action", "edit-tag")
  $(".editing-img").css("display", "block")
  $("#machineID").css("pointer-events", "none").css("opacity", "0.3")

  $.get("/api/get_tag", function (result) {
    $.each(JSON.parse(result).tag, function (key, value) {
      console.log(value);
    
      $(".tag-header").html("Edit Tag")
      $(".tag-header__desc").html("Fill out the form below to edit.")
      if (this.ID == localStorage.getItem("tag_id")) {
        $("#machineID").val(this.MachineID)
        $("#name").val(this.Location.Name)
        $(`#tag_type option[value=${this.Reassociation}]`).attr('selected', 'selected');
        $("#description").val(this.Location.Description)
        $("#address").val(this.Location.Address)
        $("#longitude").val(this.Location.Longitude)
        $("#latitude").val(this.Location.Latitude)
        
        $.get("/admin/api/d/timezone/read", function(index){
          var result = JSON.parse(index).result
          $("#timezone").append(`
            <option value="">Select time zone</option>
          `)
      
          $.each(result, function(_,tz){
            $("#timezone").append(`
              <option value="`+ tz.ID +`">`+ tz.Name +`</option>
            `)
            if (value.TimeZoneID == tz.ID){
              console.log("tz id:",value.TimeZoneID,tz.ID)
              $("#timezone").val(value.TimeZoneID)
            }
          })
        })
        return false
      }
    })
  })

  $("[data-action='edit-tag']").on('click', function () {
    if ($("#name").val() != "" && $("#description").val() != "" &&
      $("#address").val() != "" && $("longitude").val() != "" &&
      $("#latitude").val() != ""){
        
      if (this.getAttribute("data-action") == "edit-tag") {
        console.log("edit");
        $.ajax({
          url: "/api/edit_tag",
          data: {
            "id": localStorage.getItem("tag_id"),
            "name": $("#name").val(),
            "description": $("#description").val(),
            "address": $("#address").val(),
            "longitude": $("#longitude").val(),
            "latitude": $("#latitude").val(),
            "timezone": $("#timezone").val(),
            "type": $("#tag_type").val(),
          },
          success: function () {
            $(".tag-add__modal").removeClass("show");
            $(".tag-modal__container").removeClass("show");
            localStorage.removeItem("tag_id")
            window.location.reload()
          },
        });
      }
    } else {

      $("input").each(function (i, v) {
        if ($(v).attr("required") == "required" && $(v).val() == "") {

          $(v).next().css("display", "block")
          if ($("select").val() == "") {
            $("select").next().css("display", "block")
          }
        } else {
          $(v).next().css("display", "none")
          if ($("select").val() != "") {
            $("select").next().css("display", "none")
          }
        }
      })

    }
  })
}

//Press Enter for Search
$("#search-bar").on("keypress", function (e) {
  if (e.which == 13) {
    EmployeeSearch(this.value.toLowerCase());

    setInterval(function () {
      $(".cards-wrapper-tag").addClass("active");
    }, 1)
  }
})

// Onclick Search
$("#employee-search-btn").on("click", function () {
  EmployeeSearch($("#search-bar").val().toLowerCase())
  setInterval(function () {
    $(".cards-wrapper-tag").addClass("active");
  }, 1)
})

function EmployeeSearch(val) {
  $(".section-tag").empty();
  $.get("/api/get_tag", function (value) {
    $.each(JSON.parse(value).tag, function (_, emp) {
      console.log("Result", emp)
  
      if (emp.MachineID.toLowerCase().includes(val) || emp.Location.Name.toLowerCase().includes(val)) {
      
        $(".section-tag").append(`
        <div class="cards-wrapper-tag reveal">
            <div class="tag-card-header-container">
                <h3>TAG ID</h3>
                <div class="cards-edit__btn" onclick="editTag('`+emp.ID+`')">
                    <svg width="35" height="35" fill="none" stroke="#383333" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m4.75 19.25 4.25-1 9.293-9.293a1 1 0 0 0 0-1.414l-1.836-1.836a1 1 0 0 0-1.414 0L5.75 15l-1 4.25Z"></path>
                        <path d="M19.25 19.25h-5.5"></path>
                    </svg>
                </div>
            </div>
            <div class="card-details">
                <div class="machineID-details card-detail machine-id">
                    <h4 class="card-details__machineID machine-id__fs">`+ emp.MachineID +`</h4>
                </div>

                <div>
                    <h4 class="card-details__machineID machine-id__fs">`+ emp.Location.Name +`</h4>
                </div>
            </div>
        </div>
        `)
      }
    })
  })
  
    $(".section-tag").append(`
      <div class="add-tag__btn dashboard-add__btn bounce-top" onclick="createTag()">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    </div>
    `)
 
}


