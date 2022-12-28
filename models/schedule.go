package models

import (
	"fmt"
)

type Schedule struct {
	ID            uint `gorm:"primaryKey"`
	Maintenance   Maintenance
	MaintenanceID uint
	Day           int
	Repeat        bool
}

func (s *Schedule) String() string {
	return "Every " + fmt.Sprint(s.Day) + " of the month"
}
