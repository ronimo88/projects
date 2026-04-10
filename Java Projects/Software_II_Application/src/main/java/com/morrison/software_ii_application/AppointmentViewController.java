package com.morrison.software_ii_application;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import static java.lang.String.valueOf;

public class AppointmentViewController implements Initializable {

    @FXML TextField appointmentIDTextField;
    @FXML TextField titleTextField;
    @FXML TextField descriptionTextField;
    @FXML TextField locationTextField;
    @FXML TextField typeTextField;
    @FXML DatePicker startDatePicker;
    @FXML ChoiceBox<String> startHourChoiceBox;
    @FXML ChoiceBox<String> startMinuteChoiceBox;
    @FXML DatePicker endDatePicker;
    @FXML ChoiceBox<String> endHourChoiceBox;
    @FXML  ChoiceBox<String> endMinuteChoiceBox;



    public void saveButtonPressed(ActionEvent event) throws IOException, ParseException {

        //TODO set id code
        int appointmentID = 1;
        String title = titleTextField.getText();
        String description = descriptionTextField.getText();
        String location = locationTextField.getText();
        String type = typeTextField.getText();
        LocalDate startDate = startDatePicker.getValue();
        String startHour = String.valueOf(startHourChoiceBox.getValue());
        String startMinute = String.valueOf(startMinuteChoiceBox.getValue());
        String endDate = String.valueOf(endDatePicker.getValue());
        String endHour = String.valueOf(endHourChoiceBox.getValue());
        String endMinute = String.valueOf(endMinuteChoiceBox.getValue());

        String startDateTimeString=startDate + " " + startHour + ":" + startMinute;
        Date startDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(startDateTimeString);
        /*
        Date startLocalDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(startDateTimeString);
        ZonedDateTime startDateTime = startLocalDateTime.toInstant().atZone(ZoneId.of("UTC"));
        */


        String endDateTimeString=endDate + " " + endHour + ":" + endMinute;
        Date endDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(endDateTimeString);
        /*
        Date endLocalDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(endDateTimeString);
        ZonedDateTime endDateTime = endLocalDateTime.toInstant().atZone(ZoneId.of("UTC"));
        */


        Appointment newAppointment = new Appointment();

        newAppointment.setAppointmentID(appointmentID);
        newAppointment.setTitle(title);
        newAppointment.setDescription(description);
        newAppointment.setLocation(location);
        newAppointment.setType(type);
        newAppointment.setStart(startDateTime);
        newAppointment.setEnd(endDateTime);

        Database.addAppointment(newAppointment);

        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("appointment_table_view.fxml")));
        Scene viewScene = new Scene(viewParent);
        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();
        window.setScene(viewScene);
        window.show();
    }

    public void cancelButtonPressed(ActionEvent event) throws IOException {
        Parent viewParent = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("appointment_table_view.fxml")));
        Scene viewScene = new Scene(viewParent);
        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();
        window.setScene(viewScene);
        window.show();
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

        ObservableList<String> hourList = FXCollections.observableArrayList();
        hourList.addAll("00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23");
        ObservableList<String> minuteList = FXCollections.observableArrayList();
        minuteList.addAll("00","05","10","15","20","25","30","35","40","45","50","55");

        startHourChoiceBox.setItems(hourList);
        startMinuteChoiceBox.setItems(minuteList);
        endHourChoiceBox.setItems(hourList);
        endMinuteChoiceBox.setItems(minuteList);

    }
}
