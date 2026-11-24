# Clothing Store Inventory on AWS

- **Course:** AWS Cloud Computing - Individual Project (Week 12: Design & AWS Setup)
- **Author:** Zahira Anindya Putri - 24/543202/TK/60347
- **Track:** A - Cloud VM (EC2 + RDS MySQL)

A simple inventory API for a clothing store (name, material, size, brand, price, stock). A Node.js/Express API runs on EC2 and stores data in a private RDS MySQL database.

## Architecture

![Architecture Diagram](docs/Architecture%20Diagram%20AWS%20Inventory.png)

## API
 
| Operation | Endpoint |
|---|---|
| Create | `POST /clothes` |
| Read | `GET /clothes`, `GET /clothes/{id}` |
| Update | `PUT /clothes/{id}` |
| Delete | `DELETE /clothes/{id}` |
| Health check | `GET /health` |
