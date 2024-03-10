#!/bin/bash

# Set variables
mail_content_file="resources/mail-content.txt"
dest_email_file="resources/dest-email.txt"
log_file="distribution.log"
email_subject="Manta Token Distribution"

# Function to send email if mail content is not empty
send_email() {
    if [[ -s $mail_content_file ]]; then
        cat "$mail_content_file" | mail -s "$email_subject" $(cat "$dest_email_file")
    fi
}

# Create resources directory
mkdir resources
# Install dependencies and build
yarn install && yarn build    
# Start and log output
yarn start >> "$log_file"
# Send email if mail content is not empty
send_email
# remove resources directory
rm -rf resources


