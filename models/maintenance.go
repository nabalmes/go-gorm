package models

import (
	"fmt"
	"math/rand"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var letterRunes = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

type MaintenanceStatus int

func (MaintenanceStatus) Open() int {
	return 1
}
func (MaintenanceStatus) Ongoing() int {
	return 2
}
func (MaintenanceStatus) Closed() int {
	return 3
}

type MaintenanceType int

func (MaintenanceType) Scheduled() int {
	return 1
}
func (MaintenanceType) Emergency() int {
	return 2
}

type Maintenance struct {
	ID          uint `gorm:"primaryKey"`
	ReferenceID string
	Tag         Tag
	TagID       uint
	CreatedAt   *time.Time
	Location    Location
	LocationID  uint
	Status      MaintenanceStatus
	Type        MaintenanceType
	TimeStart   *time.Time
	TimeEnd     *time.Time
	Duration    *time.Duration
}

func (m *Maintenance) Save() {
	db := GormDB()

	if m.ReferenceID == "" {
		m.ReferenceID = RandStringRunes(10)
	}

	db.Save(m)
}

func (m *Maintenance) String() string {
	return m.ReferenceID + "-" + m.Tag.MachineID
}

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func GormDB() *gorm.DB {
	dsn := "root:Allen is Great 200%@tcp(127.0.0.1:3306)/pudding_v2?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Faied to Connect to the Database ", err)
	}

	return db
}
