module com.morrison.software_ii_application {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.desktop;
    requires java.sql;
    requires mysql.connector.java;


    opens com.morrison.software_ii_application to javafx.fxml;
    exports com.morrison.software_ii_application;
}