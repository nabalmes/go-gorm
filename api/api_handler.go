package api

import (
	"net/http"
	"strings"
)

// APIHandler !
func APIHandler(w http.ResponseWriter, r *http.Request) {
	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/api/")
	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/")

	if strings.HasPrefix(r.URL.Path, "employee") {
		CreateEmployee(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "get_employees") {
		GetEmployees(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "edit_employee") {
		EditEmployee(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "add_delivery") {
		CreateDelivery(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "add_maintenance") {
		AddMaintenance(w, r)
		return
	}

	// if strings.HasPrefix(r.URL.Path, "decode") {
	// 	DecodeQR(w, r)
	// 	return
	// }

	if strings.HasPrefix(r.URL.Path, "scanqr_result") {
		ScanQRResult(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "update_maintenance_status") {
		UpdateMaintenanceStatus(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "add_tag") {
		AddTag(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "update_delivery_status") {
		UpdateDeliveryStatus(w, r)
		return
	}

	// if strings.HasPrefix(r.URL.Path, "delivery_report") {
	// 	DeliveryReport(w, r)
	// 	return
	// }

	// if strings.HasPrefix(r.URL.Path, "maintenance_report") {
	// 	MaintenanceReport(w, r)
	// 	return
	// }

	if strings.HasPrefix(r.URL.Path, "reports") {
		Reports(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "get_maintenance") {
		GetMaintenance(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "search_delivery") {
		SearchDelivery(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "get_tag") {
		GetTag(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "edit_tag") {
		EditTag(w, r)
		return
	}
}
