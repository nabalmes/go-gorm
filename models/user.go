package models

type User struct {
	ID        uint
	Username  string
	Password  string
	FirstName string
	LastName  string
	Active    bool
}

func (u *User) String() string {
	return u.FirstName + " " + u.LastName
}

func (e *User) Save() {
	db := GormDB()

	db.Save(e)
}
