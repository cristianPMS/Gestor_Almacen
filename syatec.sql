-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-03-2025 a las 22:21:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `syatec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales`
--

CREATE TABLE `materiales` (
  `id` int(11) NOT NULL,
  `nombre_material` varchar(100) NOT NULL,
  `identificador` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` >= 0),
  `categoria` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material_extraido`
--

CREATE TABLE `material_extraido` (
  `id` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `id_trabajador` int(11) NOT NULL,
  `cantidad_extraida` int(11) NOT NULL CHECK (`cantidad_extraida` > 0),
  `fecha_extraccion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `material_extraido`
--
DELIMITER $$
CREATE TRIGGER `after_delete_extraccion` AFTER DELETE ON `material_extraido` FOR EACH ROW BEGIN
    UPDATE materiales 
    SET cantidad = cantidad + OLD.cantidad_extraida
    WHERE id = OLD.id_material;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_extraccion` AFTER INSERT ON `material_extraido` FOR EACH ROW BEGIN
    UPDATE materiales 
    SET cantidad = cantidad - NEW.cantidad_extraida
    WHERE id = NEW.id_material;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_extraccion` BEFORE UPDATE ON `material_extraido` FOR EACH ROW BEGIN
    -- Sumar la cantidad anterior de nuevo al stock
    UPDATE materiales 
    SET cantidad = cantidad + OLD.cantidad_extraida
    WHERE id = OLD.id_material;

    -- Restar la nueva cantidad extraída
    UPDATE materiales 
    SET cantidad = cantidad - NEW.cantidad_extraida
    WHERE id = NEW.id_material;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validar_stock` BEFORE INSERT ON `material_extraido` FOR EACH ROW BEGIN
    DECLARE stock_actual INT;
    
    -- Obtener cantidad disponible
    SELECT cantidad INTO stock_actual FROM materiales WHERE id = NEW.id_material;

    -- Verificar si hay suficiente stock
    IF NEW.cantidad_extraida > stock_actual THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No hay suficiente stock disponible';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material_ingresado`
--

CREATE TABLE `material_ingresado` (
  `id` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `id_trabajador` int(11) NOT NULL,
  `cantidad_ingresada` int(11) NOT NULL CHECK (`cantidad_ingresada` > 0),
  `fecha_ingreso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `material_ingresado`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_suma` AFTER INSERT ON `material_ingresado` FOR EACH ROW BEGIN
    UPDATE materiales
    SET cantidad = cantidad + NEW.cantidad_ingresada
    WHERE id = NEW.id_material;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_delete_ingreso` AFTER DELETE ON `material_ingresado` FOR EACH ROW BEGIN
    UPDATE materiales
    SET cantidad = cantidad - OLD.cantidad_ingresada
    WHERE id = OLD.id_material;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_ingreso` AFTER INSERT ON `material_ingresado` FOR EACH ROW BEGIN
    -- Verificamos si el material ya existe en stock
    IF EXISTS (SELECT 1 FROM materiales WHERE id = NEW.id_material) THEN
        -- Si ya existe, actualizamos la cantidad sumando la cantidad ingresada menos 1
        UPDATE materiales
        SET cantidad = cantidad + NEW.cantidad_ingresada - 1
        WHERE id = NEW.id_material;
    ELSE
        -- Si el material no existe, lo insertamos con la cantidad ingresada menos 1
        INSERT INTO materiales (id, cantidad, categoria)
        VALUES (NEW.id_material, NEW.cantidad_ingresada - 1, 'Material'); -- Restamos 1 solo temporalmente
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_ingreso` BEFORE UPDATE ON `material_ingresado` FOR EACH ROW BEGIN
    -- Calculamos la diferencia entre la nueva cantidad y la anterior
    DECLARE diferencia INT;
    SET diferencia = NEW.cantidad_ingresada - OLD.cantidad_ingresada;

    -- Ajustamos el stock en la tabla de materiales según la diferencia
    UPDATE materiales
    SET cantidad = cantidad + diferencia
    WHERE id = NEW.id_material;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajadores`
--

CREATE TABLE `trabajadores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `area` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(15) NOT NULL,
  `password` varchar(150) NOT NULL,
  `rol` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `rol`) VALUES
(1, 'admin', '$2b$10$dxfpX91h40eA0jBgwu4SuOyqu.cLlo7ajx3RS7yAC65By5q8bmUH6', 'administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `materiales`
--
ALTER TABLE `materiales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nombre_material` (`nombre_material`);

--
-- Indices de la tabla `material_extraido`
--
ALTER TABLE `material_extraido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_material` (`id_material`),
  ADD KEY `id_trabajador` (`id_trabajador`);

--
-- Indices de la tabla `material_ingresado`
--
ALTER TABLE `material_ingresado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_material` (`id_material`),
  ADD KEY `id_trabajador` (`id_trabajador`);

--
-- Indices de la tabla `trabajadores`
--
ALTER TABLE `trabajadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `materiales`
--
ALTER TABLE `materiales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `material_extraido`
--
ALTER TABLE `material_extraido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `material_ingresado`
--
ALTER TABLE `material_ingresado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `trabajadores`
--
ALTER TABLE `trabajadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `material_extraido`
--
ALTER TABLE `material_extraido`
  ADD CONSTRAINT `material_extraido_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales` (`id`),
  ADD CONSTRAINT `material_extraido_ibfk_2` FOREIGN KEY (`id_trabajador`) REFERENCES `trabajadores` (`id`);

--
-- Filtros para la tabla `material_ingresado`
--
ALTER TABLE `material_ingresado`
  ADD CONSTRAINT `material_ingresado_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales` (`id`),
  ADD CONSTRAINT `material_ingresado_ibfk_2` FOREIGN KEY (`id_trabajador`) REFERENCES `trabajadores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
