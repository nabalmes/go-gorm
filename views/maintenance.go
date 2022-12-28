package views

import (
	"net/http"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
)

func MaintenanceHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	type Maintenance struct {
		CreatedAt   string
		ID          uint
		ReferenceID string
		Tag         models.Tag
		Location    models.Location
		Status      string
		Type        string
	}

	db := GormDB()
	m := []Maintenance{}
	maintenance := []models.Maintenance{}
	today := time.Now().Format("2006-01-02")
	db.Preload("Location").Preload("Tag").Where("created_at like ?", "%"+today+"%").Order("id desc").Find(&maintenance)
	stat, types := "", ""

	for i := range maintenance {
		if maintenance[i].Tag.Reassociation == 2 {
			if maintenance[i].Status == 1 {
				stat = "Open"
			} else if maintenance[i].Status == 2 {
				stat = "Ongoing"
			} else {
				stat = "Closed"
			}
			if maintenance[i].Type == 1 {
				types = "Scheduled"
			} else {
				types = "Emergency"
			}
			m = append(m,
				Maintenance{
					CreatedAt:   maintenance[i].CreatedAt.Format("Jan 02, 2006"),
					ID:          maintenance[i].ID,
					ReferenceID: maintenance[i].ReferenceID,
					Tag:         maintenance[i].Tag,
					Location:    maintenance[i].Location,
					Status:      stat,
					Type:        types,
				})
		} else {
			db.Where("id = ?", maintenance[i].ID).Delete(&maintenance)
		}
	}

	context["Title"] = "Maintenance | Digital Alibi"
	context["Maintenance"] = m
	return context
}
