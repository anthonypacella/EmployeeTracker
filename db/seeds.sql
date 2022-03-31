INSERT INTO departments (department_name)
VALUES  ("Human Resources"),
        ("Engineering"),
        ("Accounting"),
        ("Customer Service");
       
INSERT INTO roles (role_title, role_salary, department_id)
VALUES  ("Billing Coordinator", 55000.00, 003),
        ("Representative", 33000,00, 004),
        ("Sr. Electrical Engineer", 88000.00, 002),
        ("Human Resources Manager", 60000.00, 001);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Anthony", "Pacella", 003, 002),
        ("James", "Bond", 002, 001),
        ("Ted", "Gibbons", 001, 004),
        ("Sara", "Peters", 004, 002);