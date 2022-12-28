package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/url"

	"github.com/jmcerezo/pudding-v2/api"
	"github.com/jmcerezo/pudding-v2/models"
	"github.com/jmcerezo/pudding-v2/views"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	BindIP = "0.0.0.0"
	Port   = ":2027"
)

func main() {
	u, _ := url.Parse("http://" + BindIP + Port)
	fmt.Printf("Server Started: %v\n", u)

	CreateDB("pudding_v2")
	MigrateDB()
	Handlers()
	CreateDefaultUser()

	http.ListenAndServe(Port, nil)
}

func Handlers() {
	fmt.Println("Handlers")
	http.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("./templates/"))))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	http.HandleFunc("/", views.IndexHandler)
	http.HandleFunc("/login", views.LoginHandler)
	http.HandleFunc("/logout", views.LogoutHandler)
	http.HandleFunc("/pudding/", views.PuddingHandler)
	http.HandleFunc("/api/", api.APIHandler)
}

func CreateDB(name string) *sql.DB {
	fmt.Println("Database Created")
	db, err := sql.Open("mysql", "root:Allen is Great 200%@tcp(127.0.0.1:3306)/")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS " + name)
	if err != nil {
		panic(err)
	}
	db.Close()

	db, err = sql.Open("mysql", "root:Allen is Great 200%@tcp(127.0.0.1:3306)/"+name)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	return db
}

func MigrateDB() {
	fmt.Println("Database Migrated")
	deliveries := models.Deliveries{}
	employees := models.Employee{}
	location := models.Location{}
	maintenance := models.Maintenance{}
	notification := models.Notification{}
	schedule := models.Schedule{}
	tag := models.Tag{}
	timezone := models.TimeZone{}
	user := models.User{}

	dsn := "root:Allen is Great 200%@tcp(127.0.0.1:3306)/pudding_v2?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&deliveries, &employees, &location, &maintenance, &notification, &schedule, &tag, &timezone, &user)
}

func CreateDefaultUser() {

	db := views.GormDB()
	user := []models.User{}
	db.Find(&user)

	employee := []models.Employee{}
	db.Find(&employee)
	defaultUser := []models.User{
		{
			Username:  "admin",
			Password:  hashPassword("admin"),
			FirstName: "Software",
			LastName:  "Developer",
			Active:    true,
		},
	}

	defaultEmployee := []models.Employee{
		{
			UserID:       1,
			Designation:  "Admin",
			EmployeeType: models.EmployeeType(1),
		},
	}

	isExisting := false
	for i := range defaultUser {
		isExisting = false

		for _, users := range user {
			if defaultUser[i].Username == users.Username {
				isExisting = true
				break
			}
		}

		if !isExisting {
			fmt.Println("Create Default User")
			fmt.Println("Username: admin", "Password: admin")
			db.Save(&defaultUser[i])
		}
	}

	for i := range defaultEmployee {
		isExisting = false

		for _, employees := range employee {
			if defaultEmployee[i].UserID == employees.UserID {
				isExisting = true
				break
			}
		}

		if !isExisting {
			db.Save(&defaultEmployee[i])
		}
	}
}

func hashPassword(pass string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(pass), 14)
	return string(bytes)
}
