package api

import (
	"net/http"
	"strconv"

	"github.com/jmcerezo/pudding-v2/models"
)

func GetTag(w http.ResponseWriter, r *http.Request) {
	//* Connection string for database
	db := GormDB()

	//* Models
	tag := []models.Tag{}
	db.Preload("Location").Preload("TimeZone").Find(&tag)

	activeSession := GetActiveSession(r)
	if activeSession != nil {
		res := map[string]interface{}{
			"tag": tag,
		}
		ReturnJSON(w, r, res)
	} else {
		res := map[string]interface{}{
			"status":     "error",
			"permission": "denied",
		}
		ReturnJSON(w, r, res)
	}

}

func EditTag(w http.ResponseWriter, r *http.Request) {

	//* Connection string for database
	db := GormDB()

	//* Models
	tag := models.Tag{}
	location := models.Location{}

	activeSession := GetActiveSession(r)
	if activeSession != nil {
		//* Data
		id := r.FormValue("id")
		name := r.FormValue("name")
		description := r.FormValue("description")
		address := r.FormValue("address")
		longitude := r.FormValue("longitude")
		latitude := r.FormValue("latitude")
		timezone, _ := strconv.Atoi(r.FormValue("timezone"))
		tag_type, _ := strconv.Atoi(r.FormValue("type"))

		//* Modify Tag
		db.Where("id = ?", id).Find(&tag)
		tag.TimeZoneID = uint(timezone)
		tag.Reassociation = models.Reassociation(tag_type)
		tag.Taken = false
		tag.Save()

		//* Modify Location
		db.Where("id = ?", tag.LocationID).Find(&location)
		location.Name = name
		location.Description = description
		location.Address = address
		location.Longitude = longitude
		location.Latitude = latitude
		location.Save()
		res := map[string]interface{}{
			"status": "ok",
		}
		ReturnJSON(w, r, res)
	} else {
		res := map[string]interface{}{
			"status":     "error",
			"permission": "denied",
		}
		ReturnJSON(w, r, res)
	}
}
