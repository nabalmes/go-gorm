package views

import (
	"net/http"

	"github.com/jmcerezo/pudding-v2/models"
)

func EmployeeHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	//* Connection string for database
	db := GormDB()

	//* Models
	employee := []models.Employee{}
	db.Preload("User").Find(&employee)

	context["Employee"] = employee

	context["Title"] = "Employee | Digital Alibi"
	return context
}
