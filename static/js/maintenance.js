//  * Global variables
var repeat = false;

// *Tag ID dropdown info show
$('#tag_id').change(function () {
    var tagID = $('#tag_id').val()
    $('.modal-form__del').addClass('show')
    $.get("/admin/api/d/tag/read/?$preload=1", function (t) {
      var tags = JSON.parse(t).result
      $.each(tags, function (_, tag) {
        if (tag.ID == tagID) {
          $(".modal-form__del").empty().append(`
           <div class="form-wrapper client-wrapper">
                <label for="name">Name</label>
                <p class="deliveries-details">`+ tag.Location.Name + `</p>
            </div>
  
            <div class="form-wrapper desc-wrapper">
                <label for="description">Description</label>
                <p class="deliveries-details">`+ tag.Location.Description + `</p>
            </div>
  
            <div class="form-wrapper code-wrapper">
                <label for="address">Address</label>
                <p class="deliveries-details">`+ tag.Location.Address + `</p>
            </div>
  
            <div class="form-wrapper longitude-wrapper">
                <label for="longitude">Longitude</label>
                <p class="deliveries-details">`+ tag.Location.Longitude + `</p>
            </div>
  
            <div class="form-wrapper latitude-wrapper">
                <label for="latitude">Latitude</label>
                <p class="deliveries-details">`+ tag.Location.Latitude + `</p>
            </div>
          `);
        }
      })
    })
    if (tagID == '' || tagID == ' ') {
      $('.modal-form__del').removeClass('show')
    }
  });

// *View Modal
$('.view-maintenance').on('click', function () {
    $('.view-modal').addClass('shows')
})

$(".view-modal").click(function () {
    var target = $(event.target);
    if (target.is(".view-modal")) {
        target.removeClass('shows');
    }
});
function viewDetailMain(id) {
    $('.view-modal').addClass('shows')
    $(".view-body").empty()
    $.get("/api/get_maintenance", function (result) {
        $.each(JSON.parse(result).maintenance, function (_, v) {
            if (v.ID == id) {
                if (v.Status == "Ongoing"){
                    $(".view-body").append(`
                        <div class="card-details">
    
                            <div class="address-name-details card-detail">
                                <h5>Address:</h5>
                                <h4 class="view-name">`+ v.Location.Address +`</h4>
                            </div>
            
                            <div class="address-name-details card-detail">
                                <h5>Longitude:</h5>
                                <h4 class="view-address">`+ v.Location.Longitude +`</h4>
                            </div>
            
                            <div class="status-name-details card-detail">
                                <h5>Latitude:</h5>
                                <h4 class="view-type">`+ v.Location.Latitude +`</h4>
                            </div>
    
                            <hr>
                            
                            <div class="created-name-details card-detail">
                                <h5>Tag #:</h5>
                                <h4 class="view-created">`+ v.Location.Code +`</h4>
                            </div>
            
                            <div class="created-name-details card-detail">
                                <h5>Transaction #:</h5>
                                <h4 class="view-created">`+ v.ReferenceID +`</h4>
                            </div>
    
                            <hr>
            
                            <div class="created-name-details card-detail">
                                <h5>Name:</h5>
                                <h4 class="view-created">`+ v.Location.Name + `</h4>
                            </div>
            
                            <div class="created-name-details card-detail">
                                <h5>Description:</h5>
                                <h4 class="view-created">`+ v.Location.Description +`</h4>
                            </div>
    
                            <div class="buttons-container">
                                <button id="start-btn" onclick='GetDetails(`+ JSON.stringify(v) + `)'>
                                Scan QR
                                </button>
                            </div>
    
                        </div>
                    `)
                }

                else if (v.Status == "Closed"){
                    $(".view-body").append(`
                        <div class="card-details">

                            <div class="status-name-details card-detail">
                                <h5>Status:</h5>
                                <h4 class="view-name">`+ v.Status +`</h4>
                            </div>
    
                            <div class="address-name-details card-detail">
                                <h5>Address:</h5>
                                <h4 class="view-name">`+ v.Location.Address +`</h4>
                            </div>
            
                            <div class="address-name-details card-detail">
                                <h5>Longitude:</h5>
                                <h4 class="view-address">`+ v.Location.Longitude +`</h4>
                            </div>
            
                            <div class="status-name-details card-detail">
                                <h5>Latitude:</h5>
                                <h4 class="view-type">`+ v.Location.Latitude +`</h4>
                            </div>
    
                            <hr>
                            
                            <div class="created-name-details card-detail">
                                <h5>Tag #:</h5>
                                <h4 class="view-created">`+ v.Location.Code +`</h4>
                            </div>
            
                            <div class="created-name-details card-detail">
                                <h5>Transaction #:</h5>
                                <h4 class="view-created">`+ v.ReferenceID +`</h4>
                            </div>
    
                            <hr>
            
                            <div class="created-name-details card-detail">
                                <h5>Name:</h5>
                                <h4 class="view-created">`+ v.Location.Name + `</h4>
                            </div>
            
                            <div class="created-name-details card-detail">
                                <h5>Description:</h5>
                                <h4 class="view-created">`+ v.Location.Description +`</h4>
                            </div>
    
                            <div class="buttons-container">
                                <button id="view-close-btn">
                                    Close
                                </button>
                            </div>
    
                        </div>
                    `)

                    $("#view-close-btn").on('click', function(){
                        $('.view-modal').removeClass('shows')
                        $(".start-add__modal").removeClass('show')
                    })
                }
            }
        })
    })
}

//This is for the adding delivery modal
var startBtn = document.querySelectorAll('#start-btn');
var maintenanceBtn = document.querySelector(".add-maintenance__btn");
var dashboardModal = document.querySelector(".maintenance-add__modal");
var modalContainer = document.querySelector(".maintenance-modal__container");
var cancelBtn = document.querySelector("#maintenance-cancel");

//This is for the validator modal
var startModal = document.querySelector(".start-add__modal");
var startModalContainer = document.querySelector(".start-modal__container");
var startCancel = document.getElementById('start-cancel')

maintenanceBtn.addEventListener('click', function () {
    localStorage.setItem("maintenance", JSON.stringify({id:""}))
    startModal.classList.add('show');
    $(".start-modal__container").addClass("show")

    startCancel.addEventListener("click", function () {
        startModal.classList.remove('show');
        modalContainer.style.transition = "transform 550ms ease-in-out";
        startModalContainer.classList.remove('show');
    })
    
    // dashboardModal.classList.add('show');
    // modalContainer.classList.add('show');
    // $("#tag_id").empty().append(`<option value="">Select Tag</option>`)
    // $(".schedule-container").css("display", "none")
    // $(".repeat-switch-container").removeClass("show")
    // $('.modal-form__del').removeClass('show')
    // $('#tag_id').val("")
    // $('#maintenance-type').val("")

    // $.get("/admin/api/d/tag/read/?$preload=1", function (t) {
    //     var tags = JSON.parse(t).result

    //     $.each(tags, function (_, tag) {
    //         if (tag.Taken == false && tag.Reassociation == 2) {
    //             $("#tag_id").append(`<option value="` + tag.ID + `">` + tag.MachineID + `</option>`)
    //         }
    //     })
    // })
})

cancelBtn.addEventListener('click', function () {
    dashboardModal.classList.remove('show');
    modalContainer.style.transition = "transform 550ms ease-in-out";
    modalContainer.classList.remove('show');
    $(".schedule-container").css("display", "none")
    $(".repeat-switch-container").removeClass("show")
    $('.modal-form__del').removeClass('show')
    $('#tag_id').val("")
    $('#maintenance-type').val("")
})

startBtn.forEach(function (startbutton) {
    startbutton.addEventListener("click", function () {
        startModal.classList.add('show');
        startModalContainer.classList.add('show');
    })

    startCancel.addEventListener("click", function () {
        startModal.classList.remove('show');
        modalContainer.style.transition = "transform 550ms ease-in-out";
        startModalContainer.classList.remove('show');
    })
})

function GetDetails(v) {
    localStorage.setItem("maintenance", JSON.stringify(v))

    $('.view-modal').removeClass('shows')
    $('.start-modal__container').addClass('show')
    $(".start-add__modal").addClass('show')
    
    startCancel.addEventListener("click", function () {
        startModal.classList.remove('show');
        modalContainer.style.transition = "transform 550ms ease-in-out";
        startModalContainer.classList.remove('show');
    })
}



$("#maintenance-save").on("click", function () {
    console.log("day", $(".from").text());
    if ($("#tag_id").val() != "" && $("#maintenance-type").val() != "") {
        $.ajax({
            url: "/api/add_maintenance",
            data: {
                "tag_id": $("#tag_id").val(),
                "type": $("#maintenance-type").val(),
                "day": $(".from").text(),
                "repeat": repeat,
            },
            success: function () {
                $(".maintenance-add__modal").removeClass("show");
                $(".maintenance-modal__container").removeClass("show");
                window.location.reload()
            },
        });

    } else {
        $("input").each(function (i, v) {
            if ($(v).attr("required") == "required" && $(v).val() == "") {
                $("small").css("display", "block")
                if ($("textarea").val() == "") {
                    $("textarea").next().css("display", "block")
                }
                if ($("select").val() == "") {
                    $("select").next().css("display", "block")
                }

            } else {
                $("small").css("display", "none")
                if ($("textarea").val() != "") {
                    $("textarea").next().css("display", "none")
                }
                if ($("select").val() != "") {
                    $("select").next().css("display", "none")
                }
            }
        })

    }
});


//Press Enter for Search
$("#search-bar").on("keypress", function (e) {
    if (e.which == 13) {
        MaintenanceSearch(this.value.toLowerCase());

        setInterval(function () {
            $(".cards-wrapper").addClass("active");
        }, 1)
    }
})

// Onclick Search
$("#maintenance-search-btn").on("click", function () {
    MaintenanceSearch($("#search-bar").val().toLowerCase())
    setInterval(function () {
        $(".cards-wrapper").addClass("active");
    }, 1)
})

function MaintenanceSearch(val) {
    $(".section-maintenance").empty();
    $.get("/api/get_maintenance", function (value) {
        $.each(JSON.parse(value).maintenance, function (_, main) {
            if (main.ReferenceID.toLowerCase().includes(val) || main.Location.Name.toLowerCase().includes(val) || main.Location.Address.toLowerCase().includes(val) || 
                main.Location.Description.toLowerCase().includes(val) || main.Status.toLowerCase().includes(val) || main.CreatedAt.toLowerCase().includes(val)) {
                $(".section-maintenance").append(`
                    <div class="cards-wrapper reveal">
                        <div class="cards-header">
                            <h4>`+ main.ReferenceID + `</h4>
                        </div>
                        <div class="card-details">
                
                            <div class="client-name-details card-detail">
                                <h5>Name:</h5>
                                <h4>`+ main.Location.Name + `</h4>
                            </div>

                            <div class="status-name-details card-detail">
                                <h5>Status:</h5>
                                <h4>`+ main.Status + `</h4>
                            </div>
              
                        </div>
                        <div class="buttons-container">
                            <button id="start-btn" onclick="viewDetailMain(`+ main.ID + `)">View</button>
                        </div>
                    </div>
                    <div class="add-maintenance__btn dashboard-add__btn bounce-top">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>
                `)

                // Hide add button based on employee type
                var employeeType = getCookie("employee_type")
                if (employeeType == 3) {
                    // Maintenance
                    $(".add-maintenance__btn").hide()
                }
            }
        })
    })
}

$(".slider").on('click', function () {
    $(".switch-checkbox").toggleClass("checked")

    if ($(".switch-checkbox").hasClass("checked")) {
        repeat = true;
        console.log('repeat: ', repeat)
    } else {
        repeat = false;
        console.log('repeat: ', repeat)
    }
})

$(".maintenance-type-wrapper").on("click", function () {
    if ($("#maintenance-type").val() == "1") {
        $(".schedule-container").css("display", "flex")
        $(".repeat-switch-container").addClass("show")
    } else {
        $(".schedule-container").css("display", "none")
        $(".repeat-switch-container").removeClass("show")
        $(".day").removeClass("from")
        $(".repeat-switch-container").css("opacity", "0.2").css("pointer-events", "none")
    }
});

$.each($(".day").on("click", function () {
    $(".repeat-switch-container").css("opacity", "1").css("pointer-events", "all")
    if ($(".day").hasClass("from")) {
        $(".day").removeClass("from")
        $(this).toggleClass("from")
        $(".repeat-switch-container").css("opacity", "1").css("pointer-events", "all")
    } else {
        $(this).toggleClass("from")
    }
}))


