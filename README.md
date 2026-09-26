# Sistema Distribuido de Monitoreo de Sensores

Sistema distribuido de monitoreo de temperatura que utiliza **RabbitMQ** como intermediario de mensajes para desacoplar un productor de mediciones de múltiples consumidores.

El sistema simula seis sensores que generan mediciones de temperatura periódicamente. Estas mediciones son publicadas en RabbitMQ y distribuidas hacia diferentes consumidores, que procesan la información de manera independiente.

Uno de los consumidores alimenta un dashboard en tiempo real, mientras que otro analiza las mediciones para detectar temperaturas elevadas.

---

## Arquitectura

```text
                         ┌─────────────────────┐
                         │   NestJS Producer   │
                         │                     │
                         │  6 sensores         │
                         │  Temperatura        │
                         └──────────┬──────────┘
                                    │
                                  AMQP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  sensor.exchange    │
                         │       fanout         │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌───────────────────┐           ┌───────────────────┐
          │ dashboard.queue   │           │   alerts.queue    │
          └─────────┬─────────┘           └─────────┬─────────┘
                    │                               │
                    ▼                               ▼
          ┌───────────────────┐           ┌───────────────────┐
          │ Dashboard Consumer│           │  Alerts Consumer  │
          │     Python        │           │      Python       │
          └─────────┬─────────┘           └─────────┬─────────┘
                    │                               │
                   SSE                             SSE
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │    Vue Dashboard    │
                         │                     │
                         │ Sensores            │
                         │ Temperaturas        │
                         │ Alertas             │
                         └─────────────────────┘
```

---

## Componentes

### Producer

Desarrollado con **NestJS + TypeScript**.

Es responsable de:

* Mantener la configuración de los seis sensores.
* Generar una temperatura aleatoria entre `20 °C` y `40 °C`.
* Crear una medición para cada sensor.
* Publicar las mediciones cada `2 segundos`.
* Enviar los mensajes al exchange `sensor.exchange`.

Cada medición tiene la siguiente estructura:

```json
{
  "sensor": "S01",
  "temperatura": 32.5,
  "x": 20,
  "y": 20
}
```

Los sensores utilizados son:

| Sensor |  X |  Y |
| ------ | -: | -: |
| S01    | 20 | 20 |
| S02    | 50 | 20 |
| S03    | 80 | 20 |
| S04    | 20 | 60 |
| S05    | 50 | 60 |
| S06    | 80 | 60 |

---

### RabbitMQ

RabbitMQ funciona como **broker de mensajes** entre el productor y los consumidores.

Se utiliza un exchange:

```text
sensor.exchange
```

de tipo:

```text
fanout
```

El exchange distribuye cada mensaje hacia las colas vinculadas.

```text
sensor.exchange
       │
       ├── dashboard.queue
       │
       └── alerts.queue
```

Esto permite que los consumidores sean independientes entre sí.

Por ejemplo, si el consumidor de alertas deja de funcionar, el productor no necesita conocerlo ni modificar su funcionamiento.

---

### Dashboard Consumer

Desarrollado con **Python, FastAPI y aio-pika**.

Consume mensajes desde:

```text
dashboard.queue
```

Su responsabilidad es recibir las mediciones y distribuirlas hacia los clientes conectados mediante **Server-Sent Events (SSE)**.

Endpoint:

```text
GET http://localhost:8001/events
```

El navegador mantiene una conexión abierta con este endpoint y recibe nuevas mediciones a medida que llegan.

---

### Alerts Consumer

También desarrollado con **Python, FastAPI y aio-pika**.

Consume mensajes desde:

```text
alerts.queue
```

Su función es analizar las temperaturas recibidas.

Se considera una temperatura elevada cuando:

```text
temperatura > 35 °C
```

Cuando se detecta una temperatura elevada, genera una alerta:

```json
{
  "sensor": "S03",
  "temperatura": 37.8,
  "x": 80,
  "y": 20,
  "mensaje": "Temperatura elevada en S03: 37.8°C"
}
```

Las alertas también se envían al frontend mediante SSE.

Endpoint:

```text
GET http://localhost:8002/events
```

---

### Frontend

Desarrollado con:

* Vue
* TypeScript
* Vite
* Tailwind CSS

El dashboard muestra la información recibida en tiempo real.

Incluye:

* Estado de conexión.
* Cantidad de sensores activos.
* Temperatura promedio.
* Cantidad de alertas recibidas.
* Frecuencia de actualización.
* Distribución de los sensores.
* Temperatura individual de cada sensor.
* Alertas recientes.
* Estado de cada sensor.

Los sensores mantienen una posición fija en el mapa. Las actualizaciones modifican únicamente sus valores y estados.

---

## Comunicación

El sistema utiliza diferentes mecanismos de comunicación según el componente.

### Producer → RabbitMQ

```text
AMQP
```

El productor publica las mediciones en:

```text
sensor.exchange
```

### RabbitMQ → Consumers

RabbitMQ distribuye los mensajes mediante el exchange `fanout`.

```text
sensor.exchange
        │
        ├── dashboard.queue
        │
        └── alerts.queue
```

### Consumers → Frontend

Los consumidores utilizan:

```text
Server-Sent Events (SSE)
```

Esto permite que el servidor envíe eventos al navegador sin que el frontend tenga que realizar consultas periódicas.

---

## Flujo de una medición

El flujo completo de una medición es:

```text
1. El Producer genera una temperatura
              │
              ▼
2. Crea la medición del sensor
              │
              ▼
3. Publica el mensaje en RabbitMQ
              │
              ▼
4. sensor.exchange recibe el mensaje
              │
        ┌─────┴─────┐
        ▼           ▼
 dashboard.queue  alerts.queue
        │           │
        ▼           ▼
   Dashboard      Alertas
   Consumer       Consumer
        │           │
        └─────┬─────┘
              ▼
             SSE
              │
              ▼
       Vue Dashboard
```

---

## Tecnologías

| Componente                  | Tecnología       |
| --------------------------- | ---------------- |
| Producer                    | NestJS           |
| Lenguaje Producer           | TypeScript       |
| Broker                      | RabbitMQ         |
| Protocolo de mensajería     | AMQP             |
| Dashboard Consumer          | Python + FastAPI |
| Alerts Consumer             | Python + FastAPI |
| Cliente RabbitMQ            | aio-pika         |
| Comunicación en tiempo real | SSE              |
| Frontend                    | Vue              |
| Lenguaje Frontend           | TypeScript       |
| Build tool                  | Vite             |
| Estilos                     | Tailwind CSS     |
| Infraestructura             | Docker           |

---

## Requisitos

Para ejecutar el proyecto se necesita tener instalado:

* Node.js
* npm
* Python 3
* Docker
* Docker Compose

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd sd-rabbitmq-example
```

---

## 1. Levantar RabbitMQ

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar el estado:

```bash
docker compose ps
```

RabbitMQ queda disponible en:

```text
AMQP:
localhost:5672

Management:
http://localhost:15672
```

Credenciales:

```text
Usuario: sensores
Contraseña: sensores
```

---

## 2. Ejecutar el Producer

Ingresar al directorio:

```bash
cd producer
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run start:dev
```

El producer comenzará a publicar mediciones cada dos segundos.

En la consola deberían aparecer mensajes similares a:

```text
Connected to RabbitMQ
Exchange: sensor.exchange

Published: {
  sensor: 'S01',
  temperatura: 28.4,
  x: 20,
  y: 20
}
```

---

## 3. Ejecutar Dashboard Consumer

Abrir otra terminal.

Ingresar:

```bash
cd consumers/dashboard
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activarlo en Windows:

```bash
venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Ejecutar:

```bash
uvicorn main:app --reload --port 8001
```

El servicio estará disponible en:

```text
http://localhost:8001
```

Endpoint SSE:

```text
http://localhost:8001/events
```

---

## 4. Ejecutar Alerts Consumer

Abrir otra terminal.

Ingresar:

```bash
cd consumers/alerts
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activarlo:

```bash
venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Ejecutar:

```bash
uvicorn main:app --reload --port 8002
```

El servicio estará disponible en:

```text
http://localhost:8002
```

Endpoint SSE:

```text
http://localhost:8002/events
```

---

## 5. Ejecutar Frontend

Abrir otra terminal:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

El dashboard estará disponible en:

```text
http://localhost:5173
```

---

## Ejecución completa

Para ejecutar todo el sistema se necesitan los siguientes procesos:

```text
Terminal 1
└── Docker
    └── RabbitMQ

Terminal 2
└── NestJS Producer
    └── npm run start:dev

Terminal 3
└── Dashboard Consumer
    └── uvicorn main:app --reload --port 8001

Terminal 4
└── Alerts Consumer
    └── uvicorn main:app --reload --port 8002

Terminal 5
└── Vue Frontend
    └── npm run dev
```

Una vez ejecutados todos los componentes, ingresar a:

```text
http://localhost:5173
```

---

## Funcionamiento de las alertas

El sistema considera elevada una temperatura superior a:

```text
35 °C
```

Por ejemplo:

```text
34.8 °C → Normal
35.0 °C → Normal
35.1 °C → Elevada
38.4 °C → Elevada
```

Las mediciones normales continúan siendo mostradas en el mapa y en la tabla de sensores.

Las mediciones superiores al umbral generan eventos en el consumidor de alertas.

---

## Características del dashboard

### Resumen

El dashboard presenta cuatro indicadores principales:

* Sensores activos.
* Temperatura promedio.
* Alertas recibidas.
* Frecuencia de actualización.

### Mapa

Los seis sensores se muestran en posiciones fijas.

El color representa el estado:

```text
Verde → Temperatura normal
Rojo  → Temperatura elevada
```

La posición del sensor no se modifica durante la ejecución.

### Alertas

Se muestran las alertas detectadas más recientemente.

El sistema conserva las últimas alertas recibidas en el frontend para evitar que el panel crezca indefinidamente.

### Tabla de sensores

La tabla muestra:

* Sensor.
* Temperatura.
* Coordenadas X/Y.
* Estado.

---

## Conceptos de Sistemas Distribuidos

Este proyecto permite observar diferentes conceptos relacionados con sistemas distribuidos.

### Desacoplamiento

El productor no conoce directamente a los consumidores.

```text
Producer
   │
   ▼
RabbitMQ
   │
   ├── Consumer 1
   └── Consumer 2
```

Esto permite agregar nuevos consumidores sin modificar el productor.

### Comunicación asíncrona

El productor publica mensajes sin esperar una respuesta directa de cada consumidor.

RabbitMQ actúa como intermediario entre los componentes.

### Distribución de mensajes

El exchange `fanout` permite distribuir una misma medición hacia múltiples colas.

Cada consumidor puede procesar el mensaje según sus propias necesidades.

### Independencia de componentes

Cada servicio tiene una responsabilidad específica:

```text
Producer
→ genera datos

RabbitMQ
→ distribuye mensajes

Dashboard Consumer
→ prepara datos para visualización

Alerts Consumer
→ detecta temperaturas elevadas

Frontend
→ presenta información al usuario
```

### Comunicación en tiempo real

Los consumidores utilizan SSE para enviar información al navegador inmediatamente después de recibir nuevos eventos.

---

## Estructura del proyecto

```text
sd-rabbitmq-example/
│
├── docker-compose.yml
├── .gitignore
│
├── producer/
│   ├── src/
│   │   ├── sensors/
│   │   │   ├── sensors.module.ts
│   │   │   └── sensors.service.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── app.service.ts
│   ├── package.json
│   └── ...
│
├── consumers/
│   │
│   ├── dashboard/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── venv/
│   │
│   └── alerts/
│       ├── main.py
│       ├── requirements.txt
│       └── venv/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DashboardHeader.vue
    │   │   ├── SummaryCards.vue
    │   │   ├── SensorMap.vue
    │   │   ├── AlertsPanel.vue
    │   │   └── SensorStatusTable.vue
    │   ├── App.vue
    │   ├── main.ts
    │   └── style.css
    ├── package.json
    └── ...
```

---

## Resumen

El proyecto implementa un sistema distribuido en el que un productor genera mediciones de sensores y las publica mediante RabbitMQ.

El broker desacopla al productor de los consumidores y permite que diferentes servicios procesen las mismas mediciones de forma independiente.

Finalmente, los consumidores utilizan SSE para transmitir los resultados al frontend, donde la información se visualiza en tiempo real.

```text
NestJS
   │
   │ AMQP
   ▼
RabbitMQ
   │
   ├───────────────┐
   │               │
   ▼               ▼
Dashboard       Alerts
Consumer        Consumer
   │               │
   │ SSE           │ SSE
   └───────┬───────┘
           ▼
      Vue Dashboard
```
