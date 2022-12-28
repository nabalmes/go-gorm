package models

import (
	"gorm.io/gorm"
)

type Tag struct {
	gorm.Model
	ID            uint `gorm:"primaryKey"`
	MachineID     string
	Enc           string
	Reassociation Reassociation
	Location      Location
	LocationID    uint
	TimeZone      TimeZone
	TimeZoneID    uint
	Taken         bool
}

func (e *Tag) String() string {
	return e.MachineID
}

func (t *Tag) Save() {
	db := GormDB()

	db.Save(t)
}

type Reassociation int

func (Reassociation) Courier() int {
	return 1
}
func (Reassociation) Maintenance() int {
	return 2
}
