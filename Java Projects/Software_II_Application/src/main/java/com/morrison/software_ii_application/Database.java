package com.morrison.software_ii_application;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.Initializable;

import java.net.URL;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ResourceBundle;

public class Database implements Initializable {

    private static final ObservableList<User> allUsers = FXCollections.observableArrayList();
    private static final ObservableList<Customer> allCustomers = FXCollections.observableArrayList();
    private static final ObservableList<Appointment> allAppointments = FXCollections.observableArrayList();
    private static final ObservableList<Country> allCountries = FXCollections.observableArrayList();
    private static final ObservableList<FirstLevelDimension> allFirstLevelDimensions = FXCollections.observableArrayList();



    public static void addUser(User newUser) {
        allUsers.add(newUser);
    }

    public static void addCustomer(Customer newCustomer) throws Exception {
        allCustomers.add(newCustomer);
    }

    public static void addAppointment(Appointment newAppointment) {
        allAppointments.add(newAppointment);
    }

    public static void addCountry(Country newCountry) {
        allCountries.add(newCountry);
    }

    public static void addFirstLevelDimension(FirstLevelDimension newFirstLevelDimension) {
        allFirstLevelDimensions.add(newFirstLevelDimension);
    }

    public static ObservableList<User> getAllUsers() {
        return allUsers;
    }

    public static ObservableList<Customer> getAllCustomers() {
        return allCustomers;
    }

    public static ObservableList<Appointment> getAllAppointments() {
        return allAppointments;
    }

    public static ObservableList<Country> getAllCountries() {
        return allCountries;
    }

    public static ObservableList<FirstLevelDimension> getAllFirstLevelDimensions() {
        return allFirstLevelDimensions;
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }
}
