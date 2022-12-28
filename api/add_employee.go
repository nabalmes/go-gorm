package api

import (
	"net/http"
	"strconv"

	"github.com/jmcerezo/pudding-v2/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateEmployee(w http.ResponseWriter, r *http.Request) {
	activeSession := GetActiveSession(r)

	if activeSession != nil {
		fname := r.FormValue("firstname")
		lname := r.FormValue("lastname")
		username := r.FormValue("username")
		password := r.FormValue("password")
		designation := r.FormValue("designation")
		employeeType, _ := strconv.Atoi(r.FormValue("employeeType"))

		user := models.User{}
		employee := models.Employee{}

		user.Active = true
		user.FirstName = fname
		user.LastName = lname
		user.Username = username
		user.Password = hashPassword(password)
		user.Save()

		employee.UserID = user.ID
		employee.Designation = designation
		employee.EmployeeType = models.EmployeeType(employeeType)
		employee.Save()

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

func hashPassword(pass string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(pass), 14)
	return string(bytes)
}

func GetActiveSession(r *http.Request) *http.Cookie {
	key, err := r.Cookie("session")
	if err == nil && key != nil {
		return key
	}
	return nil
}
