package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/jmcerezo/pudding-v2/models"
)

func AddTag(w http.ResponseWriter, r *http.Request) {

	//* Connection string for database
	db := GormDB()

	res := map[string]interface{}{}
	tag := models.Tag{}
	existingTags := []models.Tag{}
	db.Find(&existingTags)
	isExisting := false
	location := models.Location{}

	uid := r.FormValue("uid")
	name := r.FormValue("name")
	description := r.FormValue("description")
	longitude := r.FormValue("longitude")
	latitude := r.FormValue("latitude")
	address := r.FormValue("address")
	timezone_id, _ := strconv.Atoi(r.FormValue("timezone"))
	tag_type, _ := strconv.Atoi(r.FormValue("type"))

	// * Save Tag Details
	tag.MachineID = uid

	fmt.Printf("UID: %v\n", uid)
	resp, err := http.Get("https://repo.pudding.ws/tags/?serial=" + uid)
	if err != nil {
		fmt.Printf("Error fetching serial: %v\n", err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
	}
	x := map[string]string{}
	json.Unmarshal([]byte(body), &x)
	tag.Enc = x["Result"]

	if x["Result"] != "" {

		location.Code = uid
		location.Name = name
		location.Description = description
		location.Longitude = longitude
		location.Latitude = latitude
		location.Address = address
		location.Save()

		//* Validation for existing tags
		for i := range existingTags {
			if existingTags[i].MachineID == tag.MachineID {
				isExisting = true
				break
			}
		}
		if !isExisting {

			tag.LocationID = location.ID
			tag.TimeZoneID = uint(timezone_id)
			tag.Reassociation = models.Reassociation(tag_type)
			db.Save(&tag)
		}
	}

	// TODO: Tag activation validation on both repo
	ReturnJSON(w, r, res)
}
