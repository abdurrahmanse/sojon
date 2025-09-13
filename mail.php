<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Map new field names with graceful fallback for legacy
        $full_name = isset($_POST["full_name"]) ? $_POST["full_name"] : (isset($_POST["name"]) ? $_POST["name"] : "");
        if (empty($full_name)) {
            $f = isset($_POST["fname"]) ? $_POST["fname"] : "";
            $l = isset($_POST["lname"]) ? $_POST["lname"] : "";
            $full_name = trim($f . ' ' . $l);
        }
        $topic = isset($_POST["topic"]) ? $_POST["topic"] : (isset($_POST["subject"]) ? $_POST["subject"] : "");
        $phone = isset($_POST["phone"]) ? $_POST["phone"] : (isset($_POST["number"]) ? $_POST["number"] : "");

        // Sanitize fields
        $name = strip_tags(trim($full_name));
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim(isset($_POST["email"]) ? $_POST["email"] : ""), FILTER_SANITIZE_EMAIL);
        $subject = trim($topic);
        $message = trim(isset($_POST["message"]) ? $_POST["message"] : "");

        // Check that data was sent to the mailer.
        if ( empty($name) OR empty($message) OR empty($subject) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Please complete all required fields and try again.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "(yourmail)@gmail.com";

        // Set the email subject.
        $subject = "New contact from $subject";

        // Build the email content.
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    if (!empty($phone)) { $email_content .= "Phone: $phone\n"; }
    $email_content .= "Topic: $subject\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
    $email_headers = "From: $name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
