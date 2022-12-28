// * Modal Interactions
$(".add-location__btn").on("click", function () {
  $(".location-add__modal").toggleClass("show");
  $(".location-modal__container").toggleClass("show");
});
$("#location-cancel").on("click", function () {
  $(".location-add__modal").toggleClass("show");
  $(".location-modal__container").toggleClass("show");
});

// * Location data handlings
$("#location-save").on("click", function () {
  var session = getCookie("session");
  $.ajax({
    url:
      "/admin/api/d/location/add/?_name=" +
      $("#location").val() +
      "&_description=" +
      $("#description").val() +
      "&x-csrf-token=" +
      session,
    success: function () {
      $(".location-add__modal").toggleClass("show");
      $(".location-modal__container").toggleClass("show");
    },
  });
});
