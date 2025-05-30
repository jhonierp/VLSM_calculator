# 📌 API de Subneteo VLSM - Documentación

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

## 🚀 Descripción

Esta es una API desarrollada con **NestJS** y desplegada en **Render**. Su propósito es calcular el **subneteo VLSM** (Variable Length Subnet Masking), generando automáticamente la configuración de subredes a partir de una red base, la cantidad de subredes requeridas y el número de hosts por subred.

## 🌐 URL de Producción

```
https://vlsm-calculator.onrender.com/api

https://vlsmcalculator-production.up.railway.app/api
```


## 📄 Uso de la API

### 🔹 Endpoints Disponibles

#### **1️⃣ `GET /vlsm/calculate`**

📄 **Devuelve la configuración en formato DHCP**

**📌 Parámetros:**

- `network`: Dirección de red base _(Ejemplo: `172.18.0.0`)_
- `subnets`: Número de subredes _(Ejemplo: `3`)_
- `hosts`: Parámetro repetible para definir la cantidad de hosts por subred. Se puede usar múltiples veces _(Ejemplo: `...?hosts=500&hosts=200&hosts=100`)_

**📤 Ejemplo de petición**

```bash
curl -X 'GET' \
  'https://vlsm-calculator.onrender.com/vlsm/calculate?network=172.18.0.0&subnets=3&hosts=500&hosts=200&hosts=100' \
  -H 'accept: */*'
```

**📤 Respuesta esperada:**

```
subnet 172.18.0.0 netmask 255.255.254.0 {
  range 172.18.0.1 172.18.1.254;
  option routers 172.18.0.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
}

subnet 172.18.2.0 netmask 255.255.255.0 {
  range 172.18.2.1 172.18.2.254;
  option routers 172.18.2.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
}
```

---

#### **2️⃣ `GET /vlsm/calculate-json`**

📄 **Devuelve la configuración en formato JSON**

**📌 Parámetros:**

- `network`: Dirección de red base _(Ejemplo: `172.18.0.0`)_
- `subnets`: Número de subredes _(Ejemplo: `3`)_
- `hosts`: Lista con la cantidad de hosts por subred _(Ejemplo: `[500,200,100]`)_

**📤 Ejemplo de petición**

```bash
curl "https://vlsm-calculator.onrender.com/vlsm/calculate-json?network=172.18.0.0&subnets=3&hosts=500,200,100"
```

**📤 Ejemplo de respuesta:**

```json
{
  "subnets": [
    {
      "subnet": "172.18.0.0",
      "netmask": "255.255.254.0",
      "hosts": 500,
      "firstHost": "172.18.0.1",
      "lastHost": "172.18.1.254",
      "broadcast": "172.18.1.255"
    }
  ]
}
```

## ⚙️ Instalación y Uso Local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/jhonierp/VLSM_calculator.git
cd VLSM_calculator
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar la API en desarrollo

```bash
npm run start:dev
```

La API estará disponible en:

```
http://localhost:3001
```

## 📖 Documentación Swagger

Puedes acceder a:

```
https://vlsm-calculator.onrender.com/api
```

## 🛠 Tecnologías Usadas

- **NestJS** 🛡️ (Framework principal)
- **TypeScript** 📜 (Tipado estático)
- **Render** 🚀 (Despliegue en la nube)

## 🤝 Contribuir

Si deseas contribuir a este proyecto, eres bienvenido. Puedes reportar problemas, sugerir mejoras o enviar pull requests en el repositorio de GitHub.

🔗 Repositorio: VLSM_calculator

```
https://github.com/jhonierp/VLSM_calculator.git
```

## 📩 Contacto

📧 **Email:** jhonierpasos9@gmail.com  
🐙 **GitHub:** [jhonierp](https://github.com/jhonierp)
