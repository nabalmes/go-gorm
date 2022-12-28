package models

type Location struct {
	ID          uint
	Code        string
	Prefix      string
	Name        string
	Description string
	Address     string
	Longitude   string
	Latitude    string
	Country     string
}

func (e *Location) Save() {
	db := GormDB()

	db.Save(e)
}
