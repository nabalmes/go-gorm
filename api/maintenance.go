package api

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func GetMaintenance(w http.ResponseWriter, r *http.Request) {
	session := GetActiveSession(r)
	maintenance := []models.Maintenance{}
	db := GormDB()
	db.Preload("Location").Preload("Tag").Order("id desc").Find(&maintenance)
	stat, types := "", ""

	type Maintenance struct {
		CreatedAt   string
		ID          uint
		ReferenceID string
		Tag         models.Tag
		Location    models.Location
		Status      string
		Type        string
	}

	m := []Maintenance{}

	for i := range maintenance {
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
				CreatedAt:   maintenance[i].CreatedAt.Format("01/02/2006 03:04 PM"),
				ID:          maintenance[i].ID,
				ReferenceID: maintenance[i].ReferenceID,
				Tag:         maintenance[i].Tag,
				Location:    maintenance[i].Location,
				Status:      stat,
				Type:        types,
			})
	}

	if session != nil {
		res := map[string]interface{}{
			"maintenance": m,
		}
		ReturnJSON(w, r, res)

	} else {
		res := map[string]interface{}{
			"error":  "Permission Denied",
			"status": "error",
		}
		ReturnJSON(w, r, res)
	}
}

func AddMaintenance(w http.ResponseWriter, r *http.Request) {
	session := GetActiveSession(r)
	location := models.Location{}
	maintenance := models.Maintenance{}
	tag := models.Tag{}
	db := GormDB()
	sched_day := r.FormValue("day")
	sched_repeat := r.FormValue("repeat")
	schedule := models.Schedule{}

	if session != nil {
		tag_id, _ := strconv.Atoi(r.FormValue("tag_id"))
		m_type, _ := strconv.Atoi(r.FormValue("type"))
		db.Where("id = ?", tag_id).Find(&tag)
		tag.Taken = true
		tag.Save()

		db.Where("id = ?", tag.LocationID).Find(&location)
		location.Prefix = "mn"
		location.Save()

		maintenance.TagID = uint(tag_id)
		maintenance.LocationID = location.ID
		maintenance.Status = 1
		maintenance.Type = models.MaintenanceType(m_type)
		maintenance.Save()

		schedule.Maintenance = maintenance
		schedule.Day, _ = strconv.Atoi(sched_day)
		schedule.Repeat, _ = strconv.ParseBool(sched_repeat)
		db.Save(&schedule)

		maintenance_type := ""

		if maintenance.Type == 1 {
			maintenance_type = "n Emergency maintenance."
		}
		if maintenance.Type == 2 {
			maintenance_type = " Scheduled maintenance."
		}

		// * Create the notification here
		db.Preload("Location").Preload("Tag").Find(&maintenance)
		notif := models.Notification{}
		notif.Tag = tag
		notif.TransactionID = maintenance.ReferenceID

		db.Preload("Location").Where("reference_id = ?", notif.TransactionID).Find(&maintenance)
		notif.Description = maintenance.Tag.Location.Name + " is a now open. This is a" + maintenance_type

		notif.Seen = false
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

func UpdateMaintenanceStatus(w http.ResponseWriter, r *http.Request) {
	session := GetActiveSession(r)
	maintenance := models.Maintenance{}
	tag := models.Tag{}
	db := GormDB()
	id := r.FormValue("id")
	time, _ := time.Parse(time.RFC3339, r.FormValue("time"))

	if session != nil {
		db.Where("id = ?", id).Find(&maintenance)

		if maintenance.Status == 1 {
			//* Update time and status from open to ongoing
			maintenance.Status = 2
			maintenance.TimeStart = &time
			maintenance.Save()

		} else if maintenance.Status == 2 {
			//* Update time and status from ongoing to closed
			maintenance.Status = 3
			maintenance.TimeEnd = &time
			duration := maintenance.TimeEnd.Sub(*maintenance.TimeStart)
			maintenance.Duration = &duration
			maintenance.Save()

			db.Where("id = ?", maintenance.TagID).Find(&tag)
			tag.Taken = false
			tag.Save()
		}

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

func GormDB() *gorm.DB {
	dsn := "root:Allen is Great 200%@tcp(127.0.0.1:3306)/pudding_v2?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Faied to Connect to the Database ", err)
	}

	return db
}
