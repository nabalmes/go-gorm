
// *Modal Interactions
var employeeBtn = document.querySelector(".add-employee__btn");
var employeeSave = document.getElementById("employee-save");
var employeeModal = document.querySelector(".employee-add__modal");
var employeeContainer = document.querySelector(".employee-modal__container");
var employeeCancelBtn = document.querySelector("#employee-cancel");

employeeCancelBtn.addEventListener('click', function () {
  employeeModal.classList.remove('show');
  employeeContainer.style.transition = "transform 550ms ease-in-out";
  employeeContainer.classList.remove('show');

  $("small").css("display", "none")
})


function createEmployee() {
  employeeModal.classList.add('show');
  employeeContainer.style.transition = "transform 550ms ease-in-out";
  employeeContainer.classList.add('show');
  employeeSave.setAttribute("data-action", "save");


  $(".employee-input").val("");
  $(".username-wrapper").css('display', 'flex')
  $(".password-wrapper").css('display', 'flex')
  $("#employee_username").css('display', 'flex')
  $(".employee-header").html("Create Employee")
  $(".employee-header__desc").html("Fill out the form below to add Employee.")
  $(".editing-img").css("display", "none")


  $("[data-action='save']").on("click", function () {

    if ($("[name='username']").val() != "" && $("[name='password']").val() != "" &&
      $("[name='firstname']").val() != "" && $("[name='lastname']").val() != "" &&
      $("[name='designation']").val() != "" && $("[name='employeeType']").val() != "") {



      $.ajax({
        url: "/api/employee",
        data: {
          "username": $("#employee_username").val(),
          "password": $("#employee_password").val(),
          "firstname": $("#employee-firstname").val(),
          "lastname": $("#employee-lastname").val(),
          "designation": $("#employee-designation").val(),
          "employeeType": $("#employeeType").val(),
        },
        success: function () {
          $(".employee-add__modal").removeClass("show");
          $(".employee-modal__container").css("transition", "transform 550ms ease-in-out");
          $(".employee-modal__container").removeClass("show");
          window.location.reload()
        },
      });
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


function EditEmployee(id) {
  employeeModal.classList.add('show');
  employeeContainer.classList.add('show');
  $("#employee-save").attr("data-action", "edit-"+id)
  $(".editing-img").css("display", "block")
  $.get("/api/get_employees", function (result) {
    $.each(JSON.parse(result).employees, function (key, value) {

      $(".username-wrapper").css('display', 'none')
      $(".password-wrapper").css('display', 'none')
      $("#employee_username").css('display', 'none')
      $(".employee-header").html("Edit Employee")
      $(".employee-header__desc").html("Fill out the form below to edit Employee.")


      if (this.ID == id) {
        $("#employee-firstname").val(this.User.FirstName)
        $("#employee-lastname").val(this.User.LastName)
        $("#employee-designation").val(this.Designation)
        $("#employeeType").val(this.EmployeeType)
        return false
      }
    })
  })



  $(`[data-action='edit-${id}']`).on('click', function () {
   
    if ($("[name='firstname']").val() != "" && $("[name='lastname']").val() != "" &&
      $("[name='designation']").val() != "" && $("[name='employeeType']").val() != "") {

      if (this.getAttribute("data-action") == "edit-"+id) {
      console.log("id:",id)
        $.ajax({
          url: "/api/edit_employee",
          data: {
            "id": id,
            "firstname": $("#employee-firstname").val(),
            "lastname": $("#employee-lastname").val(),
            "designation": $("#employee-designation").val(),
            "employeeType": $("#employeeType").val(),
          },
          success: function () {
            $(".employee-add__modal").removeClass("show");
            $(".employee-modal__container").removeClass("show");
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
      $(".cards-wrapper").addClass("active");
    }, 1)
  }
})

// Onclick Search
$("#employee-search-btn").on("click", function () {
  EmployeeSearch($("#search-bar").val().toLowerCase())
  setInterval(function () {
    $(".cards-wrapper").addClass("active");
  }, 1)
})

function EmployeeSearch(val) {
  $(".section-employee").empty();
  $.get("/api/get_employees", function (value) {
    $.each(JSON.parse(value).employees, function (_, emp) {
      console.log("Result",emp)
      var empType = ""

      if (emp.User.FirstName.toLowerCase().includes(val) || emp.User.LastName.toLowerCase().includes(val) || emp.Designation.toLowerCase().includes(val)) {
        switch (emp.EmployeeType) {
          case 1:
            empType = "Admin"
            break
          case 2:
            empType = "Delivery"
            break
          case 3:
            empType = "Maintenance"
            break
        }

        $(".section-employee").append(`
          <div class="cards-wrapper reveal">
            <div class="employee-card-header">
                <h3>ID:`+ emp.ID + `</h3>
                <div class="cards-edit__btn" onclick="EditEmployee(`+ emp.ID + `)">
                    <svg width="35" height="35" fill="none" stroke="#383333" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m4.75 19.25 4.25-1 9.293-9.293a1 1 0 0 0 0-1.414l-1.836-1.836a1 1 0 0 0-1.414 0L5.75 15l-1 4.25Z"></path>
                        <path d="M19.25 19.25h-5.5"></path>
                    </svg>
                </div>
            </div>
            <div class="employee-image">
                <img src="../static/assets/img/employees/user.jpg" alt="">
            </div>
            <div class="card-details">
                <div class="full-name-details card-detail">
                    <h4 class="card-details__fname">`+ emp.User.FirstName + " " + emp.User.LastName + `</h4>
                </div>

                <div class="designation-name-details card-detail">
                    <span class="card-details__designation">`+ emp.Designation + `</span>
                </div>

                <div class="employee-type-details card-detail">
                    <h4>`+ empType + `</h4>
                </div>
            </div>
          </div>
       
        `)
      }
    })
  })
    $(".section-employee").append(`
  <div class="add-employee__btn dashboard-add__btn bounce-top" onclick="createEmployee()">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
          </div>
    `)
}



