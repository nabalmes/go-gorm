package api

import (
	"net/http"
	"strconv"

	"github.com/jmcerezo/pudding-v2/models"
)

func Reports(w http.ResponseWriter, r *http.Request) {
	activeSession := GetActiveSession(r)

	db := GormDB()

	filterby := r.FormValue("filterby")
	search, _ := strconv.Atoi(r.FormValue("search"))
	status, _ := strconv.Atoi(r.FormValue("status"))
	maintenance_type, _ := strconv.Atoi(r.FormValue("type"))
	tagID, _ := strconv.Atoi(r.FormValue("tag"))
	date_from := r.FormValue("date_from")
	date_to := r.FormValue("date_to")

	deliveries := []models.Deliveries{}
	maintenance := []models.Maintenance{}
	reports := []models.Report{}
	onload := []models.Report{}

	if activeSession != nil {

		//* Initial report
		if search == 0 && filterby == "" {
			db.Preload("Location").Preload("Tag").Order("id desc").Find(&deliveries)
			onload = append(onload, AppendDelivery(deliveries)...)

			db.Preload("Location").Preload("Tag").Order("id desc").Find(&maintenance)
			onload = append(onload, AppendMaintenance(maintenance)...)

			length := len(onload)

			res := map[string]interface{}{
				"status":  "ok",
				"length":  length,
				"reports": onload,
			}

			ReturnJSON(w, r, res)
		}

		//* DELIVERY
		if filterby == "courier" {
			if tagID == 0 && status == 0 {
				if date_from != "" && date_to != "" {
					db.Preload("Location").Preload("Tag").Where("created_at BETWEEN  ? AND  ?", date_from, date_to).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				} else {
					db.Preload("Location").Preload("Tag").Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				}

			}

			//* Search by code
			if tagID > 0 && status == 0 {
				if date_from != "" && date_to != "" {
					db.Preload("Location").Preload("Tag").Where("tag_id = ? AND (created_at BETWEEN  ? AND  ?)", tagID, date_from, date_to).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				} else {
					db.Preload("Location").Preload("Tag").Where("tag_id = ?", tagID).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				}

			}

			//* Search by code and status
			if tagID > 0 && status > 0 {
				if date_from != "" && date_to != "" {
					db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ? AND (created_at BETWEEN  ? AND  ?)", tagID, status, date_from, date_to).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				} else {
					db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ?  ", tagID, status).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				}
			}

			//* Search by status
			if tagID == 0 && status > 0 {
				if date_from != "" && date_to != "" {
					db.Preload("Location").Preload("Tag").Where("status = ? AND (created_at BETWEEN  ? AND  ?)", status, date_from, date_to).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)

				} else {
					db.Preload("Location").Preload("Tag").Where("status = ?", status).Order("id desc").Find(&deliveries)
					reports = append(reports, AppendDelivery(deliveries)...)
				}
			}

			length := len(reports)

			res := map[string]interface{}{
				"status":  "ok",
				"length":  length,
				"reports": reports,
			}

			ReturnJSON(w, r, res)
		}

		//* MAINTENANCE
		if filterby == "maintenance" {
			if tagID == 0 && status == 0 && maintenance_type == 0 {
				if date_to != "" && date_from != "" {
					db.Preload("Location").Preload("Tag").Where("created_at BETWEEN  ? AND  ?", date_from, date_to).Order("id desc").Find(&maintenance)
					reports = append(reports, AppendMaintenance(maintenance)...)
				} else {
					db.Preload("Location").Preload("Tag").Order("id desc").Find(&maintenance)
					reports = append(reports, AppendMaintenance(maintenance)...)
				}

			}

			if tagID > 0 {
				//* Filter by code only
				if tagID > 0 && status == 0 && maintenance_type == 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? AND (created_at BETWEEN  ? AND  ?)", tagID, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("tag_id = ?", tagID).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}

				//* Filter by code and status
				if tagID > 0 && status > 0 && maintenance_type == 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ?  AND (created_at BETWEEN  ? AND  ?)", tagID, status, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ?", tagID, status).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}

				//* Filter by code and type
				if tagID > 0 && status == 0 && maintenance_type > 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and type = ? AND (created_at BETWEEN  ? AND  ?)", tagID, maintenance_type, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and type = ?", tagID, maintenance_type).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}

				//* Filter by code, status and type
				if tagID > 0 && status > 0 && maintenance_type > 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ? and type = ? AND (created_at BETWEEN  ? AND  ?)", tagID, status, maintenance_type, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("tag_id = ? and status = ? and type = ?", tagID, status, maintenance_type).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}

			} else if status > 0 || maintenance_type > 0 {
				//* Filter by status only
				if status > 0 && maintenance_type == 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("status = ? AND (created_at BETWEEN  ? AND  ?)", status, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("status = ?", status).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}

				//* Filter by type only
				if maintenance_type > 0 && status == 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("type = ? AND (created_at BETWEEN  ? AND  ?)", maintenance_type, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("type = ?", maintenance_type).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}

				}

				//* Filter by status and type
				if status > 0 && maintenance_type > 0 {
					if date_to != "" && date_from != "" {
						db.Preload("Location").Preload("Tag").Where("status = ? and type = ? AND (created_at BETWEEN  ? AND  ?)", status, maintenance_type, date_from, date_to).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					} else {
						db.Preload("Location").Preload("Tag").Where("status = ? and type = ?", status, maintenance_type).Order("id desc").Find(&maintenance)
						reports = append(reports, AppendMaintenance(maintenance)...)
					}
				}
			}

			length := len(reports)

			res := map[string]interface{}{
				"status":  "ok",
				"length":  length,
				"reports": reports,
			}

			ReturnJSON(w, r, res)
		}

	} else {
		res := map[string]interface{}{
			"err_msg": "Permission denied",
			"status":  "error",
		}

		ReturnJSON(w, r, res)
	}
}

func AppendDelivery(deliveries []models.Deliveries) []models.Report {
	reports := []models.Report{}
	timestamp, stat := "", ""

	for i := range deliveries {
		if deliveries[i].TimeStamp != nil {
			timestamp = deliveries[i].TimeStamp.Format("01/02/2006 03:04 PM")
		}

		if deliveries[i].Tag.Reassociation == 1 {
			if deliveries[i].Status == 1 {
				stat = "Open"
			} else {
				stat = "Delivered"
			}
			reports = append(reports, models.Report{
				ID:        deliveries[i].ID,
				Category:  "Courier",
				CreatedAt: deliveries[i].CreatedAt.Format("01/02/2006 03:04 PM"),
				TimeStamp: timestamp,
				Status:    stat,
				Location:  deliveries[i].Location,
				Tag:       deliveries[i].Tag,
			})
		}
	}

	return reports
}

func AppendMaintenance(maintenance []models.Maintenance) []models.Report {
	reports := []models.Report{}
	start, end, duration, stat, types := "", "", "", "", ""

	for i := range maintenance {

		if maintenance[i].TimeStart != nil || maintenance[i].TimeEnd != nil || maintenance[i].Duration != nil {
			start = maintenance[i].TimeStart.Format("01/02/2006 03:04 PM")
			end = maintenance[i].TimeEnd.Format("01/02/2006 03:04 PM")
			duration = maintenance[i].Duration.String()
		}

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
			reports = append(reports, models.Report{
				ID:        maintenance[i].ID,
				Category:  "Maintenance",
				CreatedAt: maintenance[i].CreatedAt.Format("01/02/2006 03:04 PM"),
				TimeStart: start,
				TimeEnd:   end,
				Duration:  duration,
				Status:    stat,
				Type:      types,
				Location:  maintenance[i].Location,
				Tag:       maintenance[i].Tag,
			})
		}
	}

	return reports
}
