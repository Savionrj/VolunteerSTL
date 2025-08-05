# Volunteer STL

**Volunteer STL** is a full-stack web application designed to help communities organize, promote, and manage local volunteer efforts. Born out of the aftermath of the 2025 St. Louis City tornado, Volunteer STL empowers individuals and organizations to create volunteer efforts, register participants, communicate with community members, and track their involvement. The platform is built with accessibility, empathy, and community resilience in mind, offering a streamlined interface for coordinating help when and where it’s needed most.

---

## Technologies Used

### Frontend
- React (ES6)
- TailwindCSS

### Backend
- Spring Boot (Java)
- JPA / Hibernate
- MySQLWorkbench
- Lombok

### Other
- RESTful APIs
- Multipart file/image uploads
- Git & GitHub
- CORS configuration
- Postman

---

## Installation Instructions

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/Savionrj/volunteer-stl.git
    ```
2.  **Navigate to the project directory**
    ```sh
    cd volunteer-stl
    ```

3.  **Set-up database**
    ```sh
    backend/src/main/resources/application.properties

    spring.datasource.url=jdbc:mysql://localhost:3306/volunteer_stl_db
    spring.datasource.username=your_mysql_username
    spring.datasource.password=your_mysql_password

    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
    ```

4.  **Start the backend server**
    ```sh
    cd backend./mvnw spring-boot:run
    ```


5.  **Set-up the frontend**
    ```sh
    cd ../frontend
    npm install
    ```
    
6.  **Set up environment variables**
    Create a `.app.env` file in the root of your project and add your NPS API key:
    ```
    VITE_NPS_API_KEY=YOUR_API_KEY_HERE
    ```
7.  **Run the development server**
    ```sh
    npm run dev
    ```
The application should now be running on `http://localhost:5173` (or another port if specified).
