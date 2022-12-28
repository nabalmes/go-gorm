
// *Tag ID dropdown info show
$('#tag_id').change(function () {
  var tagID = $('#tag_id').val()
  $('.modal-form__del').addClass('show')
  $.get("/api/get_tag", function (t) {
    var tags = JSON.parse(t).tag
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

$('.view-modal__btn').on('click', function () {
  $('.view-modal').addClass('shows')
})

$(".view-modal").click(function () {
  var target = $(event.target);
  if (target.is(".view-modal")) {
    target.removeClass('shows');
  }
});
function viewDetail(id) {
  $('.view-modal').addClass('shows')
  $(".view-body").empty()
  $.get("/api/search_delivery", function (result) {
    $.each(JSON.parse(result).delivery, function (_, v) {
      if (this.ID === id) {
        if (v.Status == "Delivered"){
          $(".view-body").append(`
            <div class="card-details">

              <div class="status-name-details card-detail">
                  <h5>Status:</h5>
                  <h4 class="view-name">`+ v.Status +`</h4>
              </div>

              <div class="code-name-details card-detail">
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
                  <h5>Tax #:</h5>
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

        else {
          $(".view-body").append(`
            <div class="card-details">

              <div class="code-name-details card-detail">
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
                  <h5>Tax #:</h5>
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
      }
    })
  })
}


//This is for the adding delivery modal
var startBtn = document.querySelectorAll('#start-btn');
var deliveryBtn = document.querySelector(".add-delivery__btn");
var dashboardModal = document.querySelector(".deliveries-add__modal");
var modalContainer = document.querySelector(".deliveries-modal__container");
var cancelBtn = document.querySelector("#deliveries-cancel");

//This is for the validator modal
var startModal = document.querySelector(".start-add__modal");
var startModalContainer = document.querySelector(".start-modal__container");
var startCancel = document.getElementById('start-cancel')


deliveryBtn.addEventListener('click', function () {
  localStorage.setItem("delivery", JSON.stringify({id:""}))
  startModal.classList.add('show');
  // modalContainer.classList.add('show');
  $(".start-modal__container").addClass("show")

  startCancel.addEventListener("click", function () {
    startModal.classList.remove('show');
    modalContainer.style.transition = "transform 550ms ease-in-out";
    startModalContainer.classList.remove('show');
    dashboardModal.classList.remove('show');
  })

  // dashboardModal.classList.add('show');
  // $('.modal-form__del').removeClass('show')
  // $('#tag_id').val("")
  // $("#tag_id").empty().append(`<option value="">Select Tag</option>`)

  // $.get("/api/get_tag", function (t) {
  //   var tags = JSON.parse(t).tag
  //   $.each(tags, function (_, tag) {
  //     if (tag.Reassociation == 1) {
  //       $("#tag_id").append(`<option value="` + tag.ID + `">` + tag.MachineID + `</option>`)
  //     }
  //   })
  // })
})


cancelBtn.addEventListener('click', function () {
  dashboardModal.classList.remove('show');
  modalContainer.style.transition = "transform 550ms ease-in-out";
  modalContainer.classList.remove('show');
  $('.modal-form__del').removeClass('show')
  $('#tag_id').val("")
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
  localStorage.setItem("delivery", JSON.stringify(v))

  $('.view-modal').removeClass('shows')
  $('.start-modal__container').addClass('show')
  $(".start-add__modal").addClass('show')
  
  startCancel.addEventListener("click", function () {
    startModal.classList.remove('show');
    modalContainer.style.transition = "transform 550ms ease-in-out";
    startModalContainer.classList.remove('show');
})
}
// This is for the posting of data to uadmin using dAPI
$("#deliveries-save").on("click", function () {
  if ($("#tag_id").val() != "") {

    $.ajax({
      url: "/api/add_delivery",
      data: {
        "tag_id": $("#tag_id").val(),
      },
      success: function () {
        $(".deliveries-add__modal").removeClass("show");
        $(".deliveries-modal__container").css("transition", "transform 550ms ease-in-out");
        $(".deliveries-modal__container").removeClass("show");
        window.location.reload()
      },
    });

  } else {
    if ($("select").val() == "") {
      $("select").next().css("display", "block")
    }
    // $("input").each(function(i, v){
    //     console.log(v);
    //   if($(v).attr("required") == "required" && $(v).val() == ""){

    //     $(v).next().css("display","block")
    //     if($("textarea").val() == ""){
    //       $("textarea").next().css("display", "block")
    //     }
    //   }else {
    //     $(v).next().css("display","none")
    //     if($("textarea").val() != ""){
    //       $("textarea").next().css("display", "none")
    //     }
    //   }
    // })

  }
});

function Search() {
  var search = $("#search").val()
  $(".section-cards__container").empty()
  $.get("/api/search_delivery", function (result) {
    $.each(JSON.parse(result).delivery, function (_, v) {
      if (v.ReferenceID.toLowerCase().includes(search) || v.Location.Name.toLowerCase().includes(search) || v.Location.Address.toLowerCase().includes(search) || 
          v.Location.Description.toLowerCase().includes(search) || v.Status.toLowerCase().includes(search) || v.CreatedAt.toLowerCase().includes(search)) {
        $("#data").append(`
            <div class="cards-wrapper reveal">
              <div class="cards-header">
                <h4>`+ v.ReferenceID + `</h4>
              </div>

              <div class="card-details">
                <div class="client-name-details card-detail">
                  <h5>Name:</h5>
                  <h4>`+ v.Location.Name + `</h4>
                </div>
                        
                <div class="status-name-details card-detail">
                    <h5>Status:</h5>  
                    <h4>`+ v.Status + `</h4>
                </div>
              </div>
              
              <div class="buttons-container">
                  <button id="start-btn" onclick="viewDetail( `+ v.ID + ` )">View</button>
                  <!-- <button id="end-btn">End</button> -->
              </div>
            </div>
          `)
        $(".cards-wrapper").addClass("active");
      }
    })
  })
  $("#data").append(`
    <div class="add-delivery__btn dashboard-add__btn bounce-top" >
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
 `)
}

$("#search").on("keypress", function (e) {
  if (e.which == 13) {
    Search(this.value.toLowerCase());

    setInterval(function () {
      $(".cards-wrapper").addClass("active");
    }, 1)
  }
})





