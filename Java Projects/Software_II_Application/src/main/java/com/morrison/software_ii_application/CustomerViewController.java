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
import javafx.scene.chart.PieChart;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;
import java.util.ResourceBundle;
import static java.lang.Integer.parseInt;
import static java.lang.String.valueOf;

public class CustomerViewController implements Initializable {

    @FXML TextField customerIDTextField;
    @FXML TextField nameTextField;
    @FXML
    ChoiceBox<String> countryChoiceBox;
    @FXML TextField addressTextField;
    @FXML
    ChoiceBox<String> stateChoiceBox;
    @FXML TextField postalCodeTextField;
    @FXML TextField phoneTextField;


    public void saveButtonPressed(ActionEvent event) throws Exception {

        //TODO set id code
        int customerID = Database.getAllCustomers().size()+1;//TODO FIX ME
        String name = nameTextField.getText();
        String country = valueOf(countryChoiceBox);
        String address = addressTextField.getText();
        String state = valueOf(stateChoiceBox);
        int postalCode = parseInt(postalCodeTextField.getText());
        String phone = phoneTextField.getText();

        Country newCountry = new Country();
        newCountry.setCountryID(Database.getAllCountries().size()+1);//TODO FIX ME
        newCountry.setCountry(country);
        newCountry.setCreateDate(LocalDateTime.now());
        newCountry.setCreatedBy(name);
        newCountry.setLastUpdate(new Timestamp(System.currentTimeMillis()));
        newCountry.setLastUpdatedBy(name);
        Database.addCountry(newCountry);

        FirstLevelDimension newFirstLevelDimension = new FirstLevelDimension();
        newFirstLevelDimension.setDivisionID(Database.getAllFirstLevelDimensions().size()+1); //TODO FIX ME
        newFirstLevelDimension.setDivision(state);
        newFirstLevelDimension.setCreateDate(LocalDateTime.now());
        newFirstLevelDimension.setCreatedBy(name);
        newFirstLevelDimension.setLastUpdate(new Timestamp(System.currentTimeMillis()));
        newFirstLevelDimension.setLastUpdatedBy(name);
        newFirstLevelDimension.setCountryID(Database.getAllCountries().size()+1);//TODO FIX ME
        Database.addFirstLevelDimension(newFirstLevelDimension);

        Customer newCustomer = new Customer();
        newCustomer.setCustomerID(customerID);
        newCustomer.setCustomerName(name);
        newCustomer.setAddress(address);
        newCustomer.setPostalCode(postalCode);
        newCustomer.setPhone(phone);
        newCustomer.setCreateDate(LocalDateTime.now());
        newCustomer.setDivisionID(1);//TODO FIX ME
        newCustomer.setLastUpdate(new Timestamp(System.currentTimeMillis()));
        newCustomer.setLastUpdatedBy(name);
        Database.addCustomer(newCustomer);

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

        Database.addCountry(new Country(1, "United States", LocalDateTime.now(), "Ronald Morrison", new Timestamp(System.currentTimeMillis()),"Ronald Morrison" ));
        Database.addCountry(new Country(2, "United Kingdom", LocalDateTime.now(), "Ronald Morrison", new Timestamp(System.currentTimeMillis()),"Ronald Morrison" ));
        Database.addCountry(new Country(3, "Canada", LocalDateTime.now(), "Ronald Morrison", new Timestamp(System.currentTimeMillis()),"Ronald Morrison" ));

        Database.addFirstLevelDimension(new FirstLevelDimension(1, "Alabama", LocalDateTime.now(), "Ronald Morrison", new Timestamp(System.currentTimeMillis()),"Ronald Morrison", 1 ));
        Database.addFirstLevelDimension(new FirstLevelDimension(2, "Alaska", LocalDateTime.now(), "Ronald Morrison", new Timestamp(System.currentTimeMillis()),"Ronald Morrison", 1 ));

        customerIDTextField.setText(String.valueOf(Database.getAllCustomers().size()+1));

        ObservableList<String> countryNameList = FXCollections.observableArrayList();

        int size = Database.getAllCountries().size();

        for (int i = 0; i < size; i++) {
            countryNameList.add(String.valueOf(Database.getAllCountries().get(i).getCountry()));
            System.out.println(countryNameList);
        }

        countryChoiceBox.setItems(countryNameList);


    }
}
