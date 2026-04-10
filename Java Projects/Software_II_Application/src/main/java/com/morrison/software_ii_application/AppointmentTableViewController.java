package com.morrison.software_ii_application;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.Objects;
import java.util.ResourceBundle;

public class AppointmentTableViewController implements Initializable {

    @FXML
    TableView<Customer> customerTable;
    @FXML
    TableColumn<Object, Object> customerIDColumn;
    @FXML
    TableColumn<Object, Object> nameColumn;
    @FXML
    TableColumn<Object, Object> addressColumn;
    @FXML
    TableColumn<Object, Object> postalCodeColumn;
    @FXML
    TableColumn<Object, Object> phoneColumn;

    @FXML
    TableView<Appointment> appointmentTable;
    @FXML
    TableColumn<Object, Object> appointmentIDColumn;
    @FXML
    TableColumn<Object, Object> titleColumn;
    @FXML
    TableColumn<Object, Object> descriptionColumn;
    @FXML
    TableColumn<Object, Object> locationColumn;
    @FXML
    TableColumn<Object, Object> typeColumn;
    @FXML
    TableColumn<Object, Object> startDateColumn;
    @FXML
    TableColumn<Object, Object> endDateColumn;
    @FXML
    TableColumn<Object, Object> appointmentCustomerIDColumn;
    @FXML
    TableColumn<Object, Object> userIDColumn;
    @FXML
    TableColumn<Object, Object> contactIDColumn;


    public void addCustomerButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("customer_view.fxml")));
        Scene viewScene = new Scene(viewParent);

        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();

        window.setScene(viewScene);
        window.show();
    }

    public void editCustomerButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("customer_view.fxml")));
        Scene viewScene = new Scene(viewParent);

        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();

        window.setScene(viewScene);
        window.show();
    }

    public void deleteCustomerButtonPressed(ActionEvent event) throws IOException {

    }

    public void newAppointmentButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("appointment_view.fxml")));
        Scene viewScene = new Scene(viewParent);

        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();

        window.setScene(viewScene);
        window.show();
    }

    public void modifyAppointmentButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("appointment_view.fxml")));
        Scene viewScene = new Scene(viewParent);

        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();

        window.setScene(viewScene);
        window.show();
    }

    public void logoutButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("login_view.fxml")));
        Scene viewScene = new Scene(viewParent);

        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();

        window.setScene(viewScene);
        window.show();
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        customerIDColumn.setCellValueFactory(new PropertyValueFactory<>("customerID"));
        nameColumn.setCellValueFactory(new PropertyValueFactory<>("customerName"));
        addressColumn.setCellValueFactory(new PropertyValueFactory<>("address"));
        postalCodeColumn.setCellValueFactory(new PropertyValueFactory<>("postalCode"));
        phoneColumn.setCellValueFactory(new PropertyValueFactory<>("phone"));
        customerTable.setItems(Database.getAllCustomers());

        appointmentIDColumn.setCellValueFactory(new PropertyValueFactory<>("appointmentID"));
        titleColumn.setCellValueFactory(new PropertyValueFactory<>("title"));
        descriptionColumn.setCellValueFactory(new PropertyValueFactory<>("description"));
        locationColumn.setCellValueFactory(new PropertyValueFactory<>("location"));
        typeColumn.setCellValueFactory(new PropertyValueFactory<>("type"));
        startDateColumn.setCellValueFactory(new PropertyValueFactory<>("start"));
        endDateColumn.setCellValueFactory(new PropertyValueFactory<>("end"));
        appointmentCustomerIDColumn.setCellValueFactory(new PropertyValueFactory<>("customerID"));
        userIDColumn.setCellValueFactory(new PropertyValueFactory<>("userID"));
        contactIDColumn.setCellValueFactory(new PropertyValueFactory<>("contactID"));
        appointmentTable.setItems(Database.getAllAppointments());
    }
}
