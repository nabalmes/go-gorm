package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/jmcerezo/pudding-v2/models"
)

func GetEmployees(w http.ResponseWriter, r *http.Request) {

	//* Connection string for database
	db := GormDB()

	//* Models
	employee := []models.Employee{}
	db.Preload("User").Find(&employee)

	activeSession := GetActiveSession(r)
	if activeSession != nil {
		res := map[string]interface{}{
			"employees": employee,
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

func EditEmployee(w http.ResponseWriter, r *http.Request) {
	//* Connection string for database
	db := GormDB()

	//* models
	user := models.User{}
	employee := models.Employee{}

	activeSession := GetActiveSession(r)
	if activeSession != nil {
		id := r.FormValue("id")
		fname := r.FormValue("firstname")
		lname := r.FormValue("lastname")
		designation := r.FormValue("designation")
		employeeType, _ := strconv.Atoi(r.FormValue("employeeType"))

		db.Where("id = ?", id).Find(&employee)
		employee.Designation = designation
		employee.EmployeeType = models.EmployeeType(employeeType)
		employee.Save()

		db.Where("id = ? AND active = ?", employee.UserID, true).Find(&user)
		user.FirstName = fname
		user.LastName = lname
		db.Save(&user)

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

//* Data

func ReturnJSON(w http.ResponseWriter, r *http.Request, v interface{}) {
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		response := map[string]interface{}{
			"status":    "error",
			"error_msg": fmt.Sprintf("unable to encode JSON. %s", err),
		}
		b, _ = json.MarshalIndent(response, "", "  ")
		w.Header().Set("Content-Type", "application/json")
		w.Write(b)
		return
	}
	w.Write(b)
}
