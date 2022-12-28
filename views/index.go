package views

import (
	"net/http"
	"text/template"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./templates/index.html"))
	data := map[string]interface{}{}

	data["Title"] = "Digital Alibi"
	tmpl.Execute(w, data)
}
