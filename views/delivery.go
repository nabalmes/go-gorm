package views

import (
	"net/http"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
)

func DeliveryHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	db := GormDB()

	type History struct {
		ID          int
		ReferenceID string
		Tag         models.Tag
		Location    models.Location
		Status      string
		CreatedAt   string
		Type        models.Type
		Description string
	}

	history := []History{}
	deliveries := []models.Deliveries{}
	today := time.Now().Format("2006-01-02")
	db.Preload("Location").Preload("Tag").Where("created_at like ?", "%"+today+"%").Order("id desc").Find(&deliveries)
	stat := ""

	for i := range deliveries {
		if deliveries[i].Tag.Reassociation == 1 {
			if deliveries[i].Status == 1 {
				stat = "Open"
			} else {
				stat = "Delivered"
			}
			history = append(history, History{
				ID:          int(deliveries[i].ID),
				ReferenceID: deliveries[i].ReferenceID,
				Tag:         deliveries[i].Tag,
				Location:    deliveries[i].Location,
				Status:      stat,
				Type:        deliveries[i].Type,
				CreatedAt:   deliveries[i].CreatedAt.Format("01/02/2006 03:04 PM"),
				Description: deliveries[i].Location.Description,
			})
		} else {
			db.Where("id = ?", deliveries[i].ID).Delete(&deliveries)
		}
	}

	context["Title"] = "Courier | Digital Alibi"
	context["Deliveries"] = history
	return context
}
