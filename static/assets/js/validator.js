function decodeOnce(codeReader, selectedDeviceId) {
  codeReader
    .decodeFromInputVideoDevice(selectedDeviceId, "video")
    .then((result) => {
      console.log(result);
      // document.getElementById("result").textContent = result.text;
      console.log('result: ', result.text)
      var raw = "";
      var length = 0;
      var format = 0;
      for (var i in result.rawBytes) {
        i = parseInt(i);
        // check if we are not in the last byte
        if (i == result.rawBytes.length - 1) {
          break;
        }
        var val0 = toHex(result.rawBytes[i]);
        var val1 = toHex(result.rawBytes[i + 1]);
        // Get QR Code Format
        if (i == 0) {
          format = val0[0];
          length = "0x" + val0[1];
          continue;
        } else if (i == 1) {
          length += [val0[0]];
          length = parseInt(length);
        }
        // console.log(i, val0, val1);
        var tempByte = "0x" + val0[1] + val1[0];
        if (i != result.text.length - 1) {
          tempByte += ", ";
        }
        var c = parseInt(i);
        // console.log(i,c,c%10);
        if (c % 10 == 0 && i != 0) {
          tempByte += "\n";
        }
        raw += tempByte;
      }
      // document.getElementById("raw_code").textContent = raw.split("0x").join("");
      // $("#raw_code").text(raw.split("0x").join(""))  
      console.log("raw: ", raw.toString());
      console.log("formatted: ", raw.split("0x").join(""));
      console.log("raw: ", raw.split("0x").join(""))

      var pathname = window.location.pathname
      var id = ""
      if (pathname == "/pudding/deliveries"){
        var delivery = JSON.parse(localStorage.getItem("delivery"))
        id = delivery.ID

      } else if (pathname == "/pudding/maintenance"){
        var maintenance = JSON.parse(localStorage.getItem("maintenance"))
        id = maintenance.ID
      }

      $.ajax({
        method:"POST",
        url: "https://decoder.pudding.ws/api/decode",
        data: {
          "encoded_string": raw.split("0x").join(""),
          "id": id,
        },success: function(resp){
          $(".start-add__modal").removeClass("show")
          var v = JSON.parse(resp)
          console.log('v: ', v)
          $('#modalAlert').css("display", "flex")

          if (v.Status == "Error"){
            $('#results').append(`
              <h4>`+v.Error+`</h4>
            `)
          }
          
          if (v.Status == "Success"){
            $.ajax({
              method: "POST",
              url: "/api/scanqr_result",
              data: {
                "id": id,
                "uid": v.UID,
                "datetime": v.DateTime,
                "country": v.CountryCode,
              }, success: function(result){
                var res = JSON.parse(result)

                if (pathname == "/pudding/deliveries"){
                  $('#results').append(`
                    <h4>Delivery Date: `+res.DeliveryDate+`</h4>
                    <h4>Delivery Time: `+res.DeliveryTime+`</h4>
                    <hr>
                    <h4>Address: `+res.Tag.Location.Address+`</h4>
                    <h4>Longitude: `+res.Tag.Location.Longitude+`</h4>
                    <h4>Latitude: `+res.Tag.Location.Latitude+`</h4>
                    <hr>
                    <h4>Tag #: `+res.Tag.MachineID+`</h4>
                    <h4>Transaction #: `+res.Delivery.ReferenceID+`</h4>
                    <hr>
                    <h4>Name: `+res.Tag.Location.Name+`</h4>
                    <h4>Description: `+res.Tag.Location.Description+`</h4>
                  `)
    
                  localStorage.removeItem("delivery")
                }
    
                else if (pathname == "/pudding/maintenance"){
                  $('#results').append(`
                    <h4>Maintenance Date: `+res.MaintenanceDate+`</h4>
                    <h4>Time Start: `+res.TimeStart+`</h4>
                    <h4>Time End: `+res.TimeEnd+`</h4>
                    <h4>Duration: `+res.Duration+`</h4>
                    <hr>
                    <h4>Address: `+res.Tag.Location.Address+`</h4>
                    <h4>Longitude: `+res.Tag.Location.Longitude+`</h4>
                    <h4>Latitude: `+res.Tag.Location.Latitude+`</h4>
                    <hr>
                    <h4>Tag #: `+res.Tag.MachineID+`</h4>
                    <h4>Transaction #: `+res.Maintenance.ReferenceID+`</h4>
                    <hr>
                    <h4>Name: `+res.Tag.Location.Name+`</h4>
                    <h4>Description: `+res.Tag.Location.Description+`</h4>
                  `)
    
                  localStorage.removeItem("maintenance")
                }
              }
            })

            $("#close_result").on('click', function(){
              $('#modalAlert').fadeOut()
              window.location.reload()
            })
          }
        }
      })
    })
    .catch((err) => {
      console.error(err);
      // document.getElementById("result").textContent = err;
    });
}

function toHex(v) {
  var val = String(v.toString(16));
  if (val.length == 1) {
    val = "0" + val;
  }
  return val;
}

function decodeContinuously(codeReader, selectedDeviceId) {
  codeReader.decodeFromInputVideoDeviceContinuously(
    selectedDeviceId,
    "video",
    (result, err) => {
      if (result) {
        // properly decoded qr code
        console.log("Found QR code!", result);
        document.getElementById("result").textContent = result.text;
      }

      if (err) {
        // As long as this error belongs into one of the following categories
        // the code reader is going to continue as excepted. Any other error
        // will stop the decoding loop.
        //
        // Excepted Exceptions:
        //
        //  - NotFoundException
        //  - ChecksumException
        //  - FormatException

        if (err instanceof ZXing.NotFoundException) {
          console.log("No QR code found.");
        }

        if (err instanceof ZXing.ChecksumException) {
          console.log("A code was found, but it's read value was not valid.");
        }

        if (err instanceof ZXing.FormatException) {
          console.log("A code was found, but it was in a invalid format.");
        }
      }
    }
  );
}

window.addEventListener("load", function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserQRCodeReader();
  console.log("ZXing code reader initialized");

  codeReader
    .getVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement("option");
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        const sourceSelectPanel = document.getElementById("sourceSelectPanel");
        sourceSelectPanel.style.display = "block";
      }

      document.getElementById("startButton").addEventListener("click", () => {
        const decodingStyle = document.getElementById("decoding-style").value;

        if (decodingStyle == "once") {
          decodeOnce(codeReader, selectedDeviceId);
        } else {
          decodeContinuously(codeReader, selectedDeviceId);
        }

        console.log(`Started decode from camera with id ${selectedDeviceId}`);
      });

      document.getElementById("resetButton").addEventListener("click", () => {
        codeReader.reset();
        document.getElementById("result").textContent = "";
        console.log("Reset.");
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
