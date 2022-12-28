package models

type Notification struct {
	ID            uint `gorm:"primaryKey"`
	Tag           Tag
	TagID         uint
	TransactionID string
	Description   string
	Seen          bool
}

func (n *Notification) String() string {
	return n.Description
}
