package views

import (
	"net/http"
	"strings"
	"text/template"

	"github.com/jmcerezo/pudding-v2/models"
)

func PuddingHandler(w http.ResponseWriter, r *http.Request) {
	//* Connection String
	db := GormDB()
	session := r.FormValue("session")
	if session != "" {
		http.SetCookie(w, &http.Cookie{
			Name:  "session",
			Value: session,
			Path:  "/",
		})
	}

	//* check if user is not authenticated
	//* and redirect to login page

	activeSession := GetActiveSession(r)
	if activeSession == nil {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/pudding/")
	page := strings.TrimSuffix(r.URL.Path, "/")
	context := map[string]interface{}{}

	employeeType, _ := r.Cookie("employee_type")

	if employeeType.Value == "0" || employeeType.Value == "1" {
		//* Admin
		switch page {
		case "deliveries":
			context = DeliveryHandler(w, r)
		case "maintenance":
			context = MaintenanceHandler(w, r)
		case "employee":
			context = EmployeeHandler(w, r)
		case "reports":
			context = ReportsHandler(w, r)
		case "tag":
			context = TagHandler(w, r)
		case "dashboard":
			context = DashboardHandler(w, r)
		default:
			page = "dashboard"
		}
	} else if employeeType.Value == "2" {
		//* Deliveries
		switch page {
		case "dashboard":
			context = DashboardHandler(w, r)
		case "deliveries":
			context = DeliveryHandler(w, r)
		default:
			page = "dashboard"
		}

	} else if employeeType.Value == "3" {
		//* Maintenance
		switch page {
		case "dashboard":
			context = DashboardHandler(w, r)
		case "maintenance":
			context = MaintenanceHandler(w, r)
		default:
			page = "dashboard"
		}
	}

	username, _ := r.Cookie("username")
	user := models.User{}
	db.Where("username = ?", username.Value).Find(&user)

	context["user"] = user

	ParseMultiHTML(w, r, page, context)
}

func ParseMultiHTML(w http.ResponseWriter, r *http.Request, page string, context map[string]interface{}) {
	templateList := []string{}
	templateList = append(templateList, "./templates/base.html")

	path := "./templates/" + page + ".html"
	templateList = append(templateList, path)

	tmpl := template.Must(template.ParseFiles(templateList...))
	err := tmpl.ExecuteTemplate(w, "base.html", context)
	if err != nil {
		panic(err)
	}
}
