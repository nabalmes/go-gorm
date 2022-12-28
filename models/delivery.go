package models

import (
	"time"
)

type Deliveries struct {
	ID          uint `gorm:"primaryKey"`
	ReferenceID string
	Tag         Tag
	TagID       uint
	Location    Location
	LocationID  uint
	Status      Status
	Type        Type
	CreatedAt   *time.Time
	TimeStamp   *time.Time
}

type Status int

func (Status) Open() int {
	return 1
}
func (Status) Delivered() int {
	return 2
}

type Type int

func (Type) Regular() int {
	return 1
}
func (Type) Express() int {
	return 2
}

func (e *Deliveries) String() string {
	return e.ReferenceID
}

func (e *Deliveries) Save() {
	db := GormDB()

	if e.ReferenceID == "" {
		e.ReferenceID = RandStringRunes(10)
	}
	db.Save(e)
}
