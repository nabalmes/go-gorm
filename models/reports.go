package models

type Report struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt string
	Category  string
	TimeStart string
	TimeEnd   string
	Duration  string
	TimeStamp string
	Status    string
	Type      string
	Location  Location
	Tag       Tag
}
