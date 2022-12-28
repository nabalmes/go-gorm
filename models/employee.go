package models

type Employee struct {
	ID           uint `gorm:"primaryKey"`
	User         User
	UserID       uint
	Designation  string
	EmployeeType EmployeeType
}

type EmployeeType int

func (EmployeeType) Admin() int {
	return 1
}
func (EmployeeType) Delivery() int {
	return 2
}
func (EmployeeType) Maintenance() int {
	return 3
}

func (e *Employee) Save() {
	db := GormDB()

	db.Save(e)
}

func (e *Employee) String() string {
	return e.User.String()
}
