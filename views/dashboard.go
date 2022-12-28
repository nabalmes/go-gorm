package views

import (
	"fmt"
	"net/http"
	"time"

	"github.com/jmcerezo/pudding-v2/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func DashboardHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}
	deliveries := []models.Deliveries{}
	maintenance := []models.Maintenance{}
	db := GormDB()

	type TempDelivery struct {
		CreatedAt   string
		Month       string
		Day         string
		ReferenceID string
		Category    string
		TimeStamp   string
		Status      string
		Location    models.Location
		Tag         models.Tag
	}
	type TempMaintenance struct {
		CreatedAt   string
		Month       string
		Day         string
		ReferenceID string
		Category    string
		TimeStart   string
		TimeEnd     string
		Duration    string
		Status      string
		Type        string
		Location    models.Location
		Tag         models.Tag
	}

	tempDel := []TempDelivery{}
	tempMain := []TempMaintenance{}
	today := time.Now().Format("2006-01-02")
	timestamp, deliveryStatus := "", ""
	start, end, duration, stat, types := "", "", "", "", ""

	//* Deliveries
	db.Preload("Location").Preload("Tag").Where("created_at like ?", "%"+today+"%").Find(&deliveries)
	for i := range deliveries {

		if deliveries[i].TimeStamp != nil {
			timestamp = deliveries[i].TimeStamp.Format("01/02/2006 03:04 PM")
		}
		if deliveries[i].Status == 1 {
			deliveryStatus = "Open"
		} else {
			deliveryStatus = "Delivered"
		}
		tempDel = append(tempDel, TempDelivery{
			Category:    "Courier",
			ReferenceID: deliveries[i].ReferenceID,
			CreatedAt:   deliveries[i].CreatedAt.Format("01/02/2006 03:04 PM"),
			Month:       deliveries[i].CreatedAt.Format("Jan"),
			Day:         deliveries[i].CreatedAt.Format("02"),
			TimeStamp:   timestamp,
			Status:      deliveryStatus,
			Location:    deliveries[i].Location,
			Tag:         deliveries[i].Tag,
		})
	}

	//* Maintenance
	db.Preload("Location").Preload("Tag").Where("created_at like ?", "%"+today+"%").Find(&maintenance)
	for i := range maintenance {

		if maintenance[i].TimeStart != nil {
			start = maintenance[i].TimeStart.Format("01/02/2006 03:04 PM")
		}
		if maintenance[i].TimeEnd != nil {
			end = maintenance[i].TimeEnd.Format("01/02/2006 03:04 PM")
		}
		if maintenance[i].Duration != nil {
			duration = maintenance[i].Duration.String()
		}
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
		tempMain = append(tempMain, TempMaintenance{
			Category:    "Maintenance",
			ReferenceID: maintenance[i].ReferenceID,
			CreatedAt:   maintenance[i].CreatedAt.Format("01/02/2006 03:04 PM"),
			Month:       maintenance[i].CreatedAt.Format("Jan"),
			Day:         maintenance[i].CreatedAt.Format("02"),
			TimeStart:   start,
			TimeEnd:     end,
			Duration:    duration,
			Status:      stat,
			Type:        types,
			Location:    maintenance[i].Location,
			Tag:         maintenance[i].Tag,
		})
	}

	context["Deliveries"] = tempDel
	context["DeliveriesLength"] = len(tempDel)

	context["Maintenance"] = tempMain
	context["MaintenanceLength"] = len(tempMain)

	context["Title"] = "Dashboard | Digital Alibi"
	return context
}

func GormDB() *gorm.DB {
	dsn := "root:Allen is Great 200%@tcp(127.0.0.1:3306)/pudding_v2?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Faied to Connect to the Database ", err)
	}

	return db
}
