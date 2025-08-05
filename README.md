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

## Future Features

As Volunteer STL continues to grow, there are several features I plan to implement to improve usability, accessibility, and community connection:

- **Map-Based Filtering**  
  Users will be able to explore active efforts visually using an interactive map. This feature will allow volunteers to search by location, distance, or region, making it easier to find and join efforts close to home or work.

- **Enhanced User Connectivity**  
  Expanding on the current messaging and commenting systems, I plan to introduce features like group chat threads for effort participants, follower/following relationships between users, and public profiles that show a user's volunteer history and interests.

- **Volunteer Hours Tracking**  
  Volunteers will be able to log their hours and view stats related to their impact over time. Organizers will also have tools to approve hours and generate printable or downloadable service records.

- **Effort Verification & Ratings**  
  Users will be able to rate and review efforts after they end. Verified efforts and trusted organizers will be visibly marked to encourage credibility and safety.

- **Effort Reminders & Notifications**  
  Email or in-app reminders for upcoming events, new comments on joined efforts, and messages from other users.

- **Admin Dashboard**  
  A backend dashboard to help site moderators and organizers manage efforts and monitor community activity.

- **Mobile Optimization & App Version**  
  A fully responsive mobile experience is already in progress.

These features aim to make Volunteer STL not just a tool for organizing, but a community-driven hub for real, local impact.

---

**Wireframe Link**
[text](https://miro.com/welcomeonboard/MVFzelhZcDhwWFNMK3VTSm5XL0FwQUdoUUJxaE9vbEtud25iU2sydUQzVm1LZ3NMS1RjdjlWZnUrUHBHaldybWR5VG1MaVVTdVhFSGhKeitUNis4VGdablQ5RisveWJEbEFON3pWT1VVWWthZlEyY2JoZnpWUmJVdXRLZkdqTy93VHhHVHd5UWtSM1BidUtUYmxycDRnPT0hdjE=?share_link_id=715288984672)

**ERD Link**
[text](https://www.figma.com/board/sg2xek1tfqBWKgKBc7Cfrd/TW-ERD--Community-?node-id=0-1&t=wHTKDApDjYFud5jj-1)

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
