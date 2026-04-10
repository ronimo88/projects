package com.morrison.software_ii_application;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import javax.swing.*;
import java.io.IOException;
import java.net.URL;
import java.time.ZoneId;
import java.util.ResourceBundle;

import static java.lang.Integer.parseInt;

public class LoginController implements Initializable {

    @FXML
    TextField userNameTextField;

    @FXML
    TextField passwordField;


    public void loginButtonPressed(ActionEvent event) throws IOException {

        String userName = userNameTextField.getText();
        String password = passwordField.getText();

        String exceptionText = "";

        if (!userName.equals("") || !password.equals("") ) exceptionText += "User name or password is incorrect\n";

        if (exceptionText == "") {
            User newUser = new User();

            Parent viewParent = FXMLLoader.load(getClass().getResource("appointment_table_view.fxml"));
            Scene viewScene = new Scene(viewParent);
            Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();
            window.setScene(viewScene);
            window.show();

        } else {
            JOptionPane.showMessageDialog(null, exceptionText);
        }
    }

    public void exitButtonPressed(ActionEvent event) throws IOException {
        System.exit(0);
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        System.out.println(ZoneId.systemDefault());
    }
}