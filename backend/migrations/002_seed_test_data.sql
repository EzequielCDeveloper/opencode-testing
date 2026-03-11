-- ============================================================
-- 002_seed_test_data.sql  –  Datos de prueba Chapitos Gym
-- ============================================================

-- ── Usuarios del sistema (staff) ─────────────────────────────────────────────
-- Todos con password: Admin1234!
INSERT INTO users (id, name, email, password_hash, role, active) VALUES
  ('usr_staff1',   'Carlos Mendoza',    'carlos.mendoza@chapitosgym.com',   '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa', 'staff',   TRUE),
  ('usr_staff2',   'Laura Jiménez',     'laura.jimenez@chapitosgym.com',    '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa', 'staff',   TRUE),
  ('usr_billing1', 'Roberto Sánchez',   'roberto.sanchez@chapitosgym.com',  '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa', 'billing', TRUE),
  ('usr_billing2', 'Mariana Torres',    'mariana.torres@chapitosgym.com',   '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa', 'billing', TRUE),
  ('usr_staff3',   'Diego Hernández',   'diego.hernandez@chapitosgym.com',  '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa', 'staff',   FALSE)
ON CONFLICT (id) DO NOTHING;

-- ── Planes de membresía ───────────────────────────────────────────────────────
INSERT INTO membership_plans (id, name, duration_days, price_standard, price_student, active) VALUES
  ('plan_weekly',    'Semanal',    7,   180.00, 130.00, TRUE),
  ('plan_biweekly',  'Quincenal',  15,  300.00, 220.00, TRUE),
  ('plan_quarterly', 'Trimestral', 90,  1350.00, 980.00, TRUE),
  ('plan_annual',    'Anual',      365, 4800.00, 3500.00, TRUE),
  ('plan_day_pass',  'Día libre',  1,   60.00,  45.00,  TRUE)
ON CONFLICT (id) DO NOTHING;

-- ── Clientes ──────────────────────────────────────────────────────────────────
INSERT INTO clients (id, first_name, last_name, birth_date, phone, email, address, active, created_at, updated_at) VALUES
  ('cli_001', 'Ana',        'Rodríguez',    '1995-03-12', '6641234501', 'ana.rodriguez@gmail.com',      'Av. Reforma 100, Tijuana',          TRUE,  NOW() - INTERVAL '180 days', NOW() - INTERVAL '5 days'),
  ('cli_002', 'Luis',       'García',       '1990-07-22', '6641234502', 'luis.garcia@hotmail.com',      'Calle 5a 200, Tijuana',             TRUE,  NOW() - INTERVAL '170 days', NOW() - INTERVAL '10 days'),
  ('cli_003', 'Sofía',      'Martínez',     '2000-11-05', '6641234503', 'sofia.martinez@gmail.com',     'Blvd. Agua Caliente 300, Tijuana',  TRUE,  NOW() - INTERVAL '160 days', NOW() - INTERVAL '2 days'),
  ('cli_004', 'Jorge',      'López',        '1988-01-18', '6641234504', 'jorge.lopez@yahoo.com',        'Calle Revolución 400, Tijuana',     TRUE,  NOW() - INTERVAL '150 days', NOW() - INTERVAL '15 days'),
  ('cli_005', 'Valeria',    'Hernández',    '2001-06-30', '6641234505', 'valeria.hernandez@gmail.com',  'Av. Constitución 500, Tijuana',     TRUE,  NOW() - INTERVAL '140 days', NOW() - INTERVAL '1 day'),
  ('cli_006', 'Miguel',     'Pérez',        '1993-09-14', '6641234506', 'miguel.perez@gmail.com',       'Calle 2da 600, Ensenada',           TRUE,  NOW() - INTERVAL '130 days', NOW() - INTERVAL '3 days'),
  ('cli_007', 'Isabella',   'Ramírez',      '1997-04-25', '6641234507', 'isabella.ramirez@hotmail.com', 'Blvd. Costero 700, Ensenada',       TRUE,  NOW() - INTERVAL '120 days', NOW() - INTERVAL '7 days'),
  ('cli_008', 'Carlos',     'Flores',       '1985-12-01', '6641234508', 'carlos.flores@gmail.com',      'Av. Ruiz 800, Ensenada',            TRUE,  NOW() - INTERVAL '110 days', NOW() - INTERVAL '20 days'),
  ('cli_009', 'Fernanda',   'Cruz',         '2002-08-17', '6641234509', 'fernanda.cruz@gmail.com',      'Calle Obregón 900, Tecate',         TRUE,  NOW() - INTERVAL '100 days', NOW() - INTERVAL '4 days'),
  ('cli_010', 'Alejandro',  'Torres',       '1991-02-28', '6641234510', 'alejandro.torres@yahoo.com',   'Av. Juárez 1000, Tecate',           TRUE,  NOW() - INTERVAL '90 days',  NOW() - INTERVAL '6 days'),
  ('cli_011', 'Camila',     'Díaz',         '1999-10-09', '6641234511', 'camila.diaz@gmail.com',        'Blvd. Cuauhtémoc 1100, Tijuana',    TRUE,  NOW() - INTERVAL '85 days',  NOW() - INTERVAL '1 day'),
  ('cli_012', 'Ricardo',    'Morales',      '1987-05-20', '6641234512', 'ricardo.morales@hotmail.com',  'Calle Moctezuma 1200, Tijuana',     TRUE,  NOW() - INTERVAL '80 days',  NOW() - INTERVAL '8 days'),
  ('cli_013', 'Natalia',    'Ortiz',        '2003-01-14', '6641234513', 'natalia.ortiz@gmail.com',      'Av. Universidad 1300, Tijuana',     TRUE,  NOW() - INTERVAL '75 days',  NOW() - INTERVAL '2 days'),
  ('cli_014', 'Eduardo',    'Vargas',       '1994-07-03', '6641234514', 'eduardo.vargas@gmail.com',     'Blvd. Industrial 1400, Tijuana',    TRUE,  NOW() - INTERVAL '70 days',  NOW() - INTERVAL '9 days'),
  ('cli_015', 'Paola',      'Reyes',        '1998-03-22', '6641234515', 'paola.reyes@yahoo.com',        'Calle Coahuila 1500, Tijuana',      TRUE,  NOW() - INTERVAL '65 days',  NOW() - INTERVAL '3 days'),
  ('cli_016', 'Sebastián',  'Gutiérrez',    '1986-11-11', '6641234516', 'sebastian.gutierrez@gmail.com','Av. Negrete 1600, Tijuana',         TRUE,  NOW() - INTERVAL '60 days',  NOW() - INTERVAL '11 days'),
  ('cli_017', 'Daniela',    'Sánchez',      '2001-09-28', '6641234517', 'daniela.sanchez@hotmail.com',  'Calle Tercera 1700, Mexicali',      TRUE,  NOW() - INTERVAL '55 days',  NOW() - INTERVAL '5 days'),
  ('cli_018', 'Andrés',     'Romero',       '1992-04-16', '6641234518', 'andres.romero@gmail.com',      'Blvd. López Mateos 1800, Mexicali', TRUE,  NOW() - INTERVAL '50 days',  NOW() - INTERVAL '1 day'),
  ('cli_019', 'Lucía',      'Navarro',      '2000-06-07', '6641234519', 'lucia.navarro@gmail.com',      'Av. Benito Juárez 1900, Mexicali',  TRUE,  NOW() - INTERVAL '45 days',  NOW() - INTERVAL '6 days'),
  ('cli_020', 'Fernando',   'Jiménez',      '1989-08-23', '6641234520', 'fernando.jimenez@yahoo.com',   'Calle Madero 2000, Mexicali',       TRUE,  NOW() - INTERVAL '40 days',  NOW() - INTERVAL '2 days'),
  ('cli_021', 'Mariana',    'Castillo',     '1996-12-19', '6641234521', 'mariana.castillo@gmail.com',   'Av. Reforma 2100, Tijuana',         TRUE,  NOW() - INTERVAL '35 days',  NOW() - INTERVAL '7 days'),
  ('cli_022', 'Héctor',     'Mendoza',      '1984-03-05', '6641234522', 'hector.mendoza@gmail.com',     'Blvd. Sánchez Taboada 2200, TJ',   TRUE,  NOW() - INTERVAL '30 days',  NOW() - INTERVAL '3 days'),
  ('cli_023', 'Gabriela',   'Ruiz',         '2002-07-14', '6641234523', 'gabriela.ruiz@hotmail.com',    'Calle Zapata 2300, Tijuana',        TRUE,  NOW() - INTERVAL '25 days',  NOW() - INTERVAL '4 days'),
  ('cli_024', 'Javier',     'Moreno',       '1993-01-31', '6641234524', 'javier.moreno@gmail.com',      'Av. Insurgentes 2400, Tijuana',     TRUE,  NOW() - INTERVAL '20 days',  NOW() - INTERVAL '1 day'),
  ('cli_025', 'Adriana',    'Silva',        '1997-10-08', '6641234525', 'adriana.silva@gmail.com',      'Blvd. Díaz Ordaz 2500, Tijuana',   TRUE,  NOW() - INTERVAL '15 days',  NOW() - INTERVAL '5 days'),
  ('cli_026', 'Pablo',      'Aguilar',      '1990-05-27', '6641234526', 'pablo.aguilar@yahoo.com',      'Calle Altamirano 2600, Tijuana',    TRUE,  NOW() - INTERVAL '12 days',  NOW() - INTERVAL '2 days'),
  ('cli_027', 'Ximena',     'Vega',         '2001-02-13', '6641234527', 'ximena.vega@gmail.com',        'Av. Hidalgo 2700, Tijuana',         TRUE,  NOW() - INTERVAL '10 days',  NOW() - INTERVAL '1 day'),
  ('cli_028', 'Omar',       'León',         '1988-09-04', '6641234528', 'omar.leon@gmail.com',          'Blvd. 2000 2800, Tijuana',          TRUE,  NOW() - INTERVAL '8 days',   NOW() - INTERVAL '8 days'),
  ('cli_029', 'Verónica',   'Campos',       '1995-06-21', '6641234529', 'veronica.campos@hotmail.com',  'Calle Séptima 2900, Tijuana',       TRUE,  NOW() - INTERVAL '5 days',   NOW() - INTERVAL '5 days'),
  ('cli_030', 'Ignacio',    'Medina',       '1983-11-30', '6641234530', 'ignacio.medina@gmail.com',     'Av. Calafia 3000, Tijuana',         TRUE,  NOW() - INTERVAL '3 days',   NOW() - INTERVAL '3 days'),
  -- Clientes inactivos (dados de baja)
  ('cli_031', 'Patricia',   'Guerrero',     '1992-04-11', '6641234531', 'patricia.guerrero@gmail.com',  'Calle Novena 3100, Tijuana',        FALSE, NOW() - INTERVAL '200 days', NOW() - INTERVAL '60 days'),
  ('cli_032', 'Ernesto',    'Delgado',      '1980-08-16', '6641234532', 'ernesto.delgado@yahoo.com',    'Av. Mutualismo 3200, Tijuana',      FALSE, NOW() - INTERVAL '190 days', NOW() - INTERVAL '90 days'),
  ('cli_033', 'Claudia',    'Espinoza',     '1998-01-25', '6641234533', 'claudia.espinoza@gmail.com',   'Blvd. Anáhuac 3300, Tijuana',      FALSE, NOW() - INTERVAL '180 days', NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- ── Membresías ────────────────────────────────────────────────────────────────
-- Activas
INSERT INTO memberships (id, client_id, plan_id, price_type, price, start_date, end_date, status, created_by, created_at) VALUES
  ('mem_001', 'cli_001', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 15, CURRENT_DATE + 15, 'active',  'usr_admin',    NOW() - INTERVAL '15 days'),
  ('mem_002', 'cli_002', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 5,  CURRENT_DATE + 25, 'active',  'usr_staff1',   NOW() - INTERVAL '5 days'),
  ('mem_003', 'cli_003', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 20, CURRENT_DATE + 10, 'active',  'usr_staff1',   NOW() - INTERVAL '20 days'),
  ('mem_004', 'cli_004', 'plan_quarterly', 'standard', 1350.00,CURRENT_DATE - 30, CURRENT_DATE + 60, 'active',  'usr_billing1', NOW() - INTERVAL '30 days'),
  ('mem_005', 'cli_005', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 10, CURRENT_DATE + 20, 'active',  'usr_staff2',   NOW() - INTERVAL '10 days'),
  ('mem_006', 'cli_006', 'plan_biweekly',  'standard', 300.00, CURRENT_DATE - 3,  CURRENT_DATE + 12, 'active',  'usr_staff1',   NOW() - INTERVAL '3 days'),
  ('mem_007', 'cli_007', 'plan_annual',    'standard', 4800.00,CURRENT_DATE - 60, CURRENT_DATE + 305,'active',  'usr_admin',    NOW() - INTERVAL '60 days'),
  ('mem_008', 'cli_008', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 25, CURRENT_DATE + 5,  'active',  'usr_billing1', NOW() - INTERVAL '25 days'),
  ('mem_009', 'cli_009', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 12, CURRENT_DATE + 18, 'active',  'usr_staff2',   NOW() - INTERVAL '12 days'),
  ('mem_010', 'cli_010', 'plan_quarterly', 'standard', 1350.00,CURRENT_DATE - 45, CURRENT_DATE + 45, 'active',  'usr_admin',    NOW() - INTERVAL '45 days'),
  ('mem_011', 'cli_011', 'plan_weekly',    'standard', 180.00, CURRENT_DATE - 2,  CURRENT_DATE + 5,  'active',  'usr_staff1',   NOW() - INTERVAL '2 days'),
  ('mem_012', 'cli_012', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 8,  CURRENT_DATE + 22, 'active',  'usr_billing2', NOW() - INTERVAL '8 days'),
  ('mem_013', 'cli_013', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 1,  CURRENT_DATE + 29, 'active',  'usr_staff2',   NOW() - INTERVAL '1 day'),
  ('mem_014', 'cli_014', 'plan_biweekly',  'standard', 300.00, CURRENT_DATE - 7,  CURRENT_DATE + 8,  'active',  'usr_staff1',   NOW() - INTERVAL '7 days'),
  ('mem_015', 'cli_015', 'plan_annual',    'student',  3500.00,CURRENT_DATE - 90, CURRENT_DATE + 275,'active',  'usr_admin',    NOW() - INTERVAL '90 days'),
  ('mem_016', 'cli_016', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 18, CURRENT_DATE + 12, 'active',  'usr_billing1', NOW() - INTERVAL '18 days'),
  ('mem_017', 'cli_017', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 22, CURRENT_DATE + 8,  'active',  'usr_staff1',   NOW() - INTERVAL '22 days'),
  ('mem_018', 'cli_018', 'plan_quarterly', 'standard', 1350.00,CURRENT_DATE - 15, CURRENT_DATE + 75, 'active',  'usr_staff2',   NOW() - INTERVAL '15 days'),
  ('mem_019', 'cli_019', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 6,  CURRENT_DATE + 24, 'active',  'usr_billing2', NOW() - INTERVAL '6 days'),
  ('mem_020', 'cli_020', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 28, CURRENT_DATE + 2,  'active',  'usr_admin',    NOW() - INTERVAL '28 days'),
  ('mem_021', 'cli_021', 'plan_weekly',    'standard', 180.00, CURRENT_DATE - 4,  CURRENT_DATE + 3,  'active',  'usr_staff1',   NOW() - INTERVAL '4 days'),
  ('mem_022', 'cli_022', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 9,  CURRENT_DATE + 21, 'active',  'usr_billing1', NOW() - INTERVAL '9 days'),
  ('mem_023', 'cli_023', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 14, CURRENT_DATE + 16, 'active',  'usr_staff2',   NOW() - INTERVAL '14 days'),
  ('mem_024', 'cli_024', 'plan_biweekly',  'standard', 300.00, CURRENT_DATE - 5,  CURRENT_DATE + 10, 'active',  'usr_staff1',   NOW() - INTERVAL '5 days'),
  ('mem_025', 'cli_025', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 11, CURRENT_DATE + 19, 'active',  'usr_admin',    NOW() - INTERVAL '11 days'),
  -- Por vencer en menos de 5 días (para alertas del dashboard)
  ('mem_026', 'cli_026', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 27, CURRENT_DATE + 3,  'active',  'usr_billing2', NOW() - INTERVAL '27 days'),
  ('mem_027', 'cli_027', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 28, CURRENT_DATE + 2,  'active',  'usr_staff1',   NOW() - INTERVAL '28 days'),
  ('mem_028', 'cli_028', 'plan_weekly',    'standard', 180.00, CURRENT_DATE - 6,  CURRENT_DATE + 1,  'active',  'usr_staff2',   NOW() - INTERVAL '6 days'),
  ('mem_029', 'cli_029', 'plan_biweekly',  'standard', 300.00, CURRENT_DATE - 14, CURRENT_DATE + 1,  'active',  'usr_billing1', NOW() - INTERVAL '14 days'),
  ('mem_030', 'cli_030', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 29, CURRENT_DATE + 1,  'active',  'usr_admin',    NOW() - INTERVAL '29 days'),
  -- Expiradas (histórico)
  ('mem_031', 'cli_001', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 75, CURRENT_DATE - 45, 'expired', 'usr_admin',    NOW() - INTERVAL '75 days'),
  ('mem_032', 'cli_002', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 65, CURRENT_DATE - 35, 'expired', 'usr_staff1',   NOW() - INTERVAL '65 days'),
  ('mem_033', 'cli_003', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 80, CURRENT_DATE - 50, 'expired', 'usr_billing1', NOW() - INTERVAL '80 days'),
  ('mem_034', 'cli_004', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 120, CURRENT_DATE - 90,  'expired', 'usr_staff2',   NOW() - INTERVAL '120 days'),
  ('mem_035', 'cli_006', 'plan_weekly',    'standard', 180.00, CURRENT_DATE - 55,  CURRENT_DATE - 48,  'expired', 'usr_staff1',   NOW() - INTERVAL '55 days'),
  ('mem_036', 'cli_008', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 90,  CURRENT_DATE - 60,  'expired', 'usr_billing2', NOW() - INTERVAL '90 days'),
  ('mem_037', 'cli_010', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 135, CURRENT_DATE - 105, 'expired', 'usr_admin',    NOW() - INTERVAL '135 days'),
  ('mem_038', 'cli_012', 'plan_biweekly',  'standard', 300.00, CURRENT_DATE - 70,  CURRENT_DATE - 55,  'expired', 'usr_staff1',   NOW() - INTERVAL '70 days'),
  ('mem_039', 'cli_015', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 150, CURRENT_DATE - 120, 'expired', 'usr_billing1', NOW() - INTERVAL '150 days'),
  ('mem_040', 'cli_020', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 110, CURRENT_DATE - 80,  'expired', 'usr_staff2',   NOW() - INTERVAL '110 days'),
  -- Canceladas
  ('mem_041', 'cli_031', 'plan_monthly',   'standard', 500.00, CURRENT_DATE - 210, CURRENT_DATE - 180, 'cancelled','usr_admin',    NOW() - INTERVAL '210 days'),
  ('mem_042', 'cli_032', 'plan_quarterly', 'standard', 1350.00,CURRENT_DATE - 200, CURRENT_DATE - 110, 'cancelled','usr_billing1', NOW() - INTERVAL '200 days'),
  ('mem_043', 'cli_033', 'plan_monthly',   'student',  350.00, CURRENT_DATE - 190, CURRENT_DATE - 160, 'cancelled','usr_staff1',   NOW() - INTERVAL '190 days')
ON CONFLICT (id) DO NOTHING;

-- ── Pagos ─────────────────────────────────────────────────────────────────────
INSERT INTO payments (id, client_id, membership_id, amount, method, reference, paid_at, created_by) VALUES
  -- Pagos de membresías activas
  ('pay_001', 'cli_001', 'mem_001', 500.00,  'cash',          '',              NOW() - INTERVAL '15 days', 'usr_admin'),
  ('pay_002', 'cli_002', 'mem_002', 500.00,  'card',          'TXN-78234001',  NOW() - INTERVAL '5 days',  'usr_staff1'),
  ('pay_003', 'cli_003', 'mem_003', 350.00,  'cash',          '',              NOW() - INTERVAL '20 days', 'usr_staff1'),
  ('pay_004', 'cli_004', 'mem_004', 1350.00, 'bank_transfer', 'SPEI-20240301', NOW() - INTERVAL '30 days', 'usr_billing1'),
  ('pay_005', 'cli_005', 'mem_005', 350.00,  'cash',          '',              NOW() - INTERVAL '10 days', 'usr_staff2'),
  ('pay_006', 'cli_006', 'mem_006', 300.00,  'card',          'TXN-78234006',  NOW() - INTERVAL '3 days',  'usr_staff1'),
  ('pay_007', 'cli_007', 'mem_007', 4800.00, 'bank_transfer', 'SPEI-20240101', NOW() - INTERVAL '60 days', 'usr_admin'),
  ('pay_008', 'cli_008', 'mem_008', 500.00,  'cash',          '',              NOW() - INTERVAL '25 days', 'usr_billing1'),
  ('pay_009', 'cli_009', 'mem_009', 350.00,  'card',          'TXN-78234009',  NOW() - INTERVAL '12 days', 'usr_staff2'),
  ('pay_010', 'cli_010', 'mem_010', 1350.00, 'bank_transfer', 'SPEI-20240115', NOW() - INTERVAL '45 days', 'usr_admin'),
  ('pay_011', 'cli_011', 'mem_011', 180.00,  'cash',          '',              NOW() - INTERVAL '2 days',  'usr_staff1'),
  ('pay_012', 'cli_012', 'mem_012', 500.00,  'card',          'TXN-78234012',  NOW() - INTERVAL '8 days',  'usr_billing2'),
  ('pay_013', 'cli_013', 'mem_013', 350.00,  'cash',          '',              NOW() - INTERVAL '1 day',   'usr_staff2'),
  ('pay_014', 'cli_014', 'mem_014', 300.00,  'card',          'TXN-78234014',  NOW() - INTERVAL '7 days',  'usr_staff1'),
  ('pay_015', 'cli_015', 'mem_015', 3500.00, 'bank_transfer', 'SPEI-20231201', NOW() - INTERVAL '90 days', 'usr_admin'),
  ('pay_016', 'cli_016', 'mem_016', 500.00,  'cash',          '',              NOW() - INTERVAL '18 days', 'usr_billing1'),
  ('pay_017', 'cli_017', 'mem_017', 350.00,  'card',          'TXN-78234017',  NOW() - INTERVAL '22 days', 'usr_staff1'),
  ('pay_018', 'cli_018', 'mem_018', 1350.00, 'bank_transfer', 'SPEI-20240215', NOW() - INTERVAL '15 days', 'usr_staff2'),
  ('pay_019', 'cli_019', 'mem_019', 350.00,  'cash',          '',              NOW() - INTERVAL '6 days',  'usr_billing2'),
  ('pay_020', 'cli_020', 'mem_020', 500.00,  'card',          'TXN-78234020',  NOW() - INTERVAL '28 days', 'usr_admin'),
  ('pay_021', 'cli_021', 'mem_021', 180.00,  'cash',          '',              NOW() - INTERVAL '4 days',  'usr_staff1'),
  ('pay_022', 'cli_022', 'mem_022', 500.00,  'card',          'TXN-78234022',  NOW() - INTERVAL '9 days',  'usr_billing1'),
  ('pay_023', 'cli_023', 'mem_023', 350.00,  'cash',          '',              NOW() - INTERVAL '14 days', 'usr_staff2'),
  ('pay_024', 'cli_024', 'mem_024', 300.00,  'bank_transfer', 'SPEI-20240305', NOW() - INTERVAL '5 days',  'usr_staff1'),
  ('pay_025', 'cli_025', 'mem_025', 500.00,  'card',          'TXN-78234025',  NOW() - INTERVAL '11 days', 'usr_admin'),
  ('pay_026', 'cli_026', 'mem_026', 500.00,  'cash',          '',              NOW() - INTERVAL '27 days', 'usr_billing2'),
  ('pay_027', 'cli_027', 'mem_027', 350.00,  'card',          'TXN-78234027',  NOW() - INTERVAL '28 days', 'usr_staff1'),
  ('pay_028', 'cli_028', 'mem_028', 180.00,  'cash',          '',              NOW() - INTERVAL '6 days',  'usr_staff2'),
  ('pay_029', 'cli_029', 'mem_029', 300.00,  'bank_transfer', 'SPEI-20240225', NOW() - INTERVAL '14 days', 'usr_billing1'),
  ('pay_030', 'cli_030', 'mem_030', 500.00,  'cash',          '',              NOW() - INTERVAL '29 days', 'usr_admin'),
  -- Pagos de membresías expiradas (histórico)
  ('pay_031', 'cli_001', 'mem_031', 500.00,  'cash',          '',              NOW() - INTERVAL '75 days', 'usr_admin'),
  ('pay_032', 'cli_002', 'mem_032', 500.00,  'card',          'TXN-67123001',  NOW() - INTERVAL '65 days', 'usr_staff1'),
  ('pay_033', 'cli_003', 'mem_033', 350.00,  'cash',          '',              NOW() - INTERVAL '80 days', 'usr_billing1'),
  ('pay_035', 'cli_006', 'mem_035', 180.00,  'cash',          '',              NOW() - INTERVAL '55 days', 'usr_staff1'),
  ('pay_036', 'cli_008', 'mem_036', 500.00,  'card',          'TXN-67123006',  NOW() - INTERVAL '90 days', 'usr_billing2'),
  ('pay_038', 'cli_012', 'mem_038', 300.00,  'cash',          '',              NOW() - INTERVAL '70 days', 'usr_staff1')
ON CONFLICT (id) DO NOTHING;

-- ── Audit logs de muestra ─────────────────────────────────────────────────────
INSERT INTO audit_logs (id, user_id, action, entity, entity_id, before_json, after_json, created_at) VALUES
  ('aud_001', 'usr_admin',    'CREATE', 'client',     'cli_001', '', '{"first_name":"Ana","last_name":"Rodríguez","active":true}',        NOW() - INTERVAL '180 days'),
  ('aud_002', 'usr_admin',    'CREATE', 'client',     'cli_002', '', '{"first_name":"Luis","last_name":"García","active":true}',          NOW() - INTERVAL '170 days'),
  ('aud_003', 'usr_staff1',   'CREATE', 'membership', 'mem_001', '', '{"plan_id":"plan_monthly","status":"active","price":500.00}',       NOW() - INTERVAL '15 days'),
  ('aud_004', 'usr_staff1',   'CREATE', 'payment',    'pay_001', '', '{"amount":500.00,"method":"cash"}',                                 NOW() - INTERVAL '15 days'),
  ('aud_005', 'usr_billing1', 'CREATE', 'membership', 'mem_004', '', '{"plan_id":"plan_quarterly","status":"active","price":1350.00}',    NOW() - INTERVAL '30 days'),
  ('aud_006', 'usr_billing1', 'CREATE', 'payment',    'pay_004', '', '{"amount":1350.00,"method":"bank_transfer"}',                      NOW() - INTERVAL '30 days'),
  ('aud_007', 'usr_admin',    'CREATE', 'membership', 'mem_007', '', '{"plan_id":"plan_annual","status":"active","price":4800.00}',       NOW() - INTERVAL '60 days'),
  ('aud_008', 'usr_admin',    'CREATE', 'payment',    'pay_007', '', '{"amount":4800.00,"method":"bank_transfer"}',                      NOW() - INTERVAL '60 days'),
  ('aud_009', 'usr_admin',    'UPDATE', 'client',     'cli_031', '{"active":true}', '{"active":false}',                                  NOW() - INTERVAL '60 days'),
  ('aud_010', 'usr_admin',    'UPDATE', 'membership', 'mem_041', '{"status":"active"}', '{"status":"cancelled"}',                        NOW() - INTERVAL '60 days'),
  ('aud_011', 'usr_staff2',   'CREATE', 'client',     'cli_009', '', '{"first_name":"Fernanda","last_name":"Cruz","active":true}',       NOW() - INTERVAL '100 days'),
  ('aud_012', 'usr_staff2',   'CREATE', 'membership', 'mem_009', '', '{"plan_id":"plan_monthly","status":"active","price":350.00}',      NOW() - INTERVAL '12 days'),
  ('aud_013', 'usr_billing2', 'CREATE', 'membership', 'mem_019', '', '{"plan_id":"plan_monthly","status":"active","price":350.00}',      NOW() - INTERVAL '6 days'),
  ('aud_014', 'usr_billing2', 'CREATE', 'payment',    'pay_019', '', '{"amount":350.00,"method":"cash"}',                                NOW() - INTERVAL '6 days'),
  ('aud_015', 'usr_admin',    'CREATE', 'client',     'cli_030', '', '{"first_name":"Ignacio","last_name":"Medina","active":true}',      NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;
