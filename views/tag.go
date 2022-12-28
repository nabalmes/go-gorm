package views

import (
	"net/http"

	"github.com/jmcerezo/pudding-v2/models"
)

func TagHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	db := GormDB()

	//* Models

	tag := []models.Tag{}
	db.Preload("Location").Find(&tag)

	context["Title"] = "Tag | Digital Alibi"
	context["Tag"] = tag
	return context
}
