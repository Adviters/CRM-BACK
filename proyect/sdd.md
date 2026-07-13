# CRM Veterinario

## Objetivo

El sistema permite administrar clientes, mascotas, turnos, vacunas e historias clínicas de una veterinaria.

El sistema es utilizado únicamente por empleados de la veterinaria.

Los clientes no poseen acceso al sistema.

---

# Usuarios

Existen tres tipos de usuarios.

## ADMIN

Administrador del sistema.

Puede administrar completamente el CRM.

Responsabilidades:

* crear usuarios
* modificar usuarios
* desactivar usuarios
* consultar toda la información
* administrar roles

---

## VETERINARIAN

Veterinario.

Responsabilidades:

* consultar clientes
* consultar mascotas
* visualizar historial clínico
* crear consultas
* registrar diagnósticos
* registrar tratamientos
* registrar vacunas
* registrar peso
* registrar observaciones

No puede administrar usuarios.

No puede eliminar clientes.

---

## RECEPTIONIST

Recepcionista.

Responsabilidades:

* registrar clientes
* modificar información de contacto
* registrar mascotas
* actualizar datos básicos de mascotas
* gestionar agenda
* crear turnos
* modificar turnos
* cancelar turnos

No puede modificar información médica.

---

# Cliente

Representa al dueño de una o más mascotas.

Datos:

* nombre
* apellido
* documento
* teléfono
* email
* dirección

Un cliente puede poseer múltiples mascotas.

---

# Mascota

Representa un paciente.

Pertenece exactamente a un cliente.

Datos:

* nombre
* especie
* raza
* sexo
* fecha de nacimiento
* peso actual
* color
* observaciones generales

Una mascota posee:

* historia clínica
* vacunas
* turnos

---

# Historia clínica

Cada consulta veterinaria genera un nuevo registro.

Nunca se modifica el historial anterior.

Cada registro contiene:

* fecha
* veterinario
* motivo de consulta
* diagnóstico
* tratamiento
* observaciones
* peso

La historia clínica representa una línea temporal de la salud de la mascota.

---

# Vacunas

Cada vacuna aplicada queda registrada.

Datos:

* nombre
* fecha de aplicación
* próxima aplicación
* veterinario

Una mascota puede tener múltiples vacunas.

---

# Turnos

Representan visitas programadas.

Estados:

* PENDING
* CONFIRMED
* COMPLETED
* CANCELLED

Datos:

* fecha
* hora
* veterinario
* mascota
* motivo

Cuando un turno se completa puede generar una nueva historia clínica.

---

# Dashboard

Mostrar indicadores generales.

* cantidad de clientes
* cantidad de mascotas
* turnos del día
* vacunas próximas a vencer
* consultas realizadas

---

# Reglas de negocio

* Un cliente puede tener muchas mascotas.
* Una mascota pertenece a un único cliente.
* Solo un veterinario puede crear historias clínicas.
* Solo un veterinario puede registrar vacunas.
* Una historia clínica nunca se elimina.
* Cada consulta crea un nuevo registro histórico.
* La recepcionista nunca puede modificar información médica.
* El administrador posee acceso completo.
* Todos los accesos requieren autenticación mediante JWT.
* Todas las acciones deben registrarse con usuario y fecha de creación.
* Las entidades deben utilizar UUID como identificador primario.
* Las operaciones de eliminación deben realizarse mediante soft delete cuando sea aplicable.
