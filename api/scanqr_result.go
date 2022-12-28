package api

import (
	"net/http"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
)

func ScanQRResult(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	uid := r.FormValue("uid")
	datetime, _ := time.Parse(time.RFC3339, r.FormValue("datetime"))
	country := r.FormValue("country")

	db := GormDB()
	tag := models.Tag{}
	db.Preload("Location").Preload("TimeZone").Where("machine_id = ?", uid).Find(&tag)

	if tag.Reassociation == 1 {
		//* Delivery
		delivery := models.Deliveries{}
		delivery.Status = 2
		delivery.TimeStamp = &datetime
		delivery.TagID = tag.ID
		delivery.LocationID = tag.LocationID
		delivery.Save()

		ReturnJSON(w, r, map[string]interface{}{
			"Status":       "Success",
			"DateTime":     datetime,
			"DeliveryDate": datetime.Format("2006-01-02"),
			"DeliveryTime": datetime.Format("03:04 PM"),
			"Delivery":     delivery,
			"Tag":          tag,
			"CountryCode":  country,
			"UID":          uid,
		})

	} else if tag.Reassociation == 2 {
		//* Maintenance
		maintenance := models.Maintenance{}
		start, end, duration := "", "", ""

		if id != "" {
			//* Update Ongoing maintenance status to Closed
			db.Where("id = ?", id).Find(&maintenance)
			maintenance.Status = 3
			maintenance.TimeEnd = &datetime
			m_duration := maintenance.TimeEnd.Sub(*maintenance.TimeStart)
			maintenance.Duration = &m_duration
			maintenance.TagID = tag.ID
			maintenance.LocationID = tag.LocationID
			db.Save(&maintenance)
			start = maintenance.TimeStart.Format("03:04 PM")
			end = maintenance.TimeEnd.Format("03:04 PM")
			duration = maintenance.Duration.String()

			ReturnJSON(w, r, map[string]interface{}{
				"Status":          "Success",
				"DateTime":        datetime,
				"MaintenanceDate": maintenance.TimeStart.Format("2006-01-02"),
				"TimeStart":       start,
				"TimeEnd":         end,
				"Duration":        duration,
				"Maintenance":     maintenance,
				"Tag":             tag,
				"CountryCode":     country,
				"UID":             uid,
			})

		} else {
			main := []models.Maintenance{}
			today := time.Now().Format("2006-01-02")
			db.Where("created_at like ? and tag_id = ? and status = 2", "%"+today+"%", tag.ID).Find(&main)

			if len(main) == 0 {
				//* Saving of new maintenance
				maintenance.Status = 2
				maintenance.TimeStart = &datetime
				maintenance.TagID = tag.ID
				maintenance.LocationID = tag.LocationID
				maintenance.Save()
				start = maintenance.TimeStart.Format("03:04 PM")

				ReturnJSON(w, r, map[string]interface{}{
					"Status":          "Success",
					"DateTime":        datetime,
					"MaintenanceDate": maintenance.TimeStart.Format("2006-01-02"),
					"TimeStart":       start,
					"TimeEnd":         end,
					"Duration":        duration,
					"Maintenance":     maintenance,
					"Tag":             tag,
					"CountryCode":     country,
					"UID":             uid,
				})

			} else {
				//* Get ongoing maintenance
				ongoingMain := models.Maintenance{}
				db.Where("created_at like ? and tag_id = ? and status = 2", "%"+today+"%", tag.ID).Find(&ongoingMain)
				start = ongoingMain.TimeStart.Format("03:04 PM")

				ReturnJSON(w, r, map[string]interface{}{
					"Status":          "Success",
					"DateTime":        datetime,
					"MaintenanceDate": ongoingMain.TimeStart.Format("2006-01-02"),
					"TimeStart":       start,
					"TimeEnd":         end,
					"Duration":        duration,
					"Maintenance":     maintenance,
					"Tag":             tag,
					"CountryCode":     country,
					"UID":             uid,
				})
			}
		}
	}
}
