package views

import "net/http"

func ReportsHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	context["Title"] = "Reports | Digital Alibi"
	return context
}
