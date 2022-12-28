package models

import (
	"time"

	"gorm.io/gorm"
)

type TimeZone struct {
	gorm.Model
	Name string
	Zone string
}

func (z *TimeZone) String() string {
	return z.Name
}

func TimeIn(name string) time.Time {
	t := time.Now()
	loc, _ := time.LoadLocation(name)
	t = t.In(loc)

	time_now, _ := time.Parse(time.RFC3339, t.Format(time.RFC3339))
	return time_now
}
func TimeInTime(t time.Time, name string) string {
	loc, _ := time.LoadLocation(name)
	t = t.In(loc)
	return t.Format("Jan 02, 2006 03:04 PM")
}
