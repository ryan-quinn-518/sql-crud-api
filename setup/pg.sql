CREATE DATABASE IF NOT EXISTS sql_crud_api;
USE sql_crud_api;
CREATE TABLE sql_crud_test( record_id SERIAL PRIMARY KEY, text_data VARCHAR(256) NOT NULL, creation_date TIMESTAMP );