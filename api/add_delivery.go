package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
)

func SearchDelivery(w http.ResponseWriter, r *http.Request) {

	db := GormDB()

	activeSession := GetActiveSession(r)

	if activeSession != nil {
		type History struct {
			ID          uint
			ReferenceID string
			Tag         models.Tag
			Location    models.Location
			Status      string
			TimeStamp   string
			CreatedAt   string
			Type        models.Type
			Description string
		}

		history := []History{}
		deliveries := []models.Deliveries{}
		db.Preload("Location").Preload("Tag").Order("id desc").Find(&deliveries)
		timestamp, stat := "", ""

		for i := range deliveries {
			if deliveries[i].TimeStamp != nil {
				timestamp = deliveries[i].TimeStamp.Format("01/02/2006 03:04 PM")
			}
			if deliveries[i].Status == 1 {
				stat = "Open"
			} else {
				stat = "Delivered"
			}
			history = append(history, History{
				ID:          deliveries[i].ID,
				ReferenceID: deliveries[i].ReferenceID,
				Tag:         deliveries[i].Tag,
				Location:    deliveries[i].Location,
				Status:      stat,
				TimeStamp:   timestamp,
				Type:        deliveries[i].Type,
				CreatedAt:   deliveries[i].CreatedAt.Format("01/02/2006 03:04 PM"),
				Description: deliveries[i].Location.Description,
			})
		}
		res := map[string]interface{}{
			"status":   "ok",
			"delivery": history,
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

func CreateDelivery(w http.ResponseWriter, r *http.Request) {
	db := GormDB()

	activeSession := GetActiveSession(r)
	location := models.Location{}
	deliver := models.Deliveries{}
	tag := models.Tag{}
	notif := models.Notification{}

	if activeSession != nil {
		tag_id, _ := strconv.Atoi(r.FormValue("tag_id"))
		db.Where("id = ?", tag_id).Find(&tag)
		tag.CreatedAt = time.Now()
		tag.Taken = true
		tag.Save()

		db.Where("id = ?", tag.LocationID).Find(&location)
		location.Prefix = "dr"
		location.Save()

		deliver.TagID = uint(tag_id)
		deliver.LocationID = tag.LocationID
		deliver.Status = models.Status(1)
		deliver.Save()

		notif.TransactionID = deliver.ReferenceID
		notif.TagID = deliver.TagID
		notif.Seen = false
		db.Save(&notif)

		db.Preload("Location").Where("reference_id = ?", notif.TransactionID).Find(&deliver)

		notif.Description = deliver.Location.Name + " is ready for delivery."
		db.Save(&notif)

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

func UpdateDeliveryStatus(w http.ResponseWriter, r *http.Request) {
	db := GormDB()

	activeSession := GetActiveSession(r)
	delivery := models.Deliveries{}
	tag := models.Tag{}
	id := r.FormValue("id")
	time, _ := time.Parse(time.RFC3339, r.FormValue("time"))

	if activeSession != nil {
		db.Where("id = ?", id).Find(&delivery)

		delivery.Status = 2
		delivery.TimeStamp = &time
		delivery.Save()

		db.Where("id = ?", delivery.TagID).Find(&tag)
		tag.Taken = false
		tag.Save()

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
