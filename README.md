# Alpp Food – LB Phone Bestell-App

Moderne Food-Delivery-App für **LB Phone** (FiveM). Kunden bestellen Essen, Mitarbeiter verwalten Bestellungen und Auslieferungen in Echtzeit.

## Features

### Kundenbereich
- Startseite mit Restaurantname, Logo und Speisekarte
- Kategorien: Burger, Pizza, Pasta, Salate, Getränke, Desserts
- Warenkorb mit Mengenänderung und Entfernen
- Checkout mit Name, Telefon, Adresse, Hinweis und Zahlungsart
- Bestellbestätigung mit Bestellnummer

### Mitarbeiterbereich
- **Dashboard** mit Kennzahlen (neue Bestellungen, Status, Tagesumsatz)
- **Bestellungen** – alle Bestellungen mit Statusänderung per Klick
- **Auslieferungen** – nur bereite/unterwegs-Bestellungen
- **🚚 Zur Auslieferung** – markiert Bestellung sofort als „Unterwegs“
- Echtzeit-Aktualisierung für alle Mitarbeiter

### Bestellstatus
1. Neue Bestellung
2. In Bearbeitung
3. Bereit zur Lieferung
4. Unterwegs
5. Ausgeliefert
6. Storniert

## Installation

### Voraussetzungen
- [LB Phone](https://store.lbscripts.com/) muss installiert und gestartet sein
- Optional: ESX oder QBCore für Mitarbeiter-Job-Prüfung

### Setup

1. Repository in deinen `resources`-Ordner klonen:
   ```bash
   git clone https://github.com/entenluca/bestell-app-lb-phone.git
   ```

2. UI bauen (falls noch nicht gebaut):
   ```bash
   cd bestell-app-lb-phone/ui
   npm install
   npm run build
   ```

3. In `server.cfg` eintragen (**lb-phone muss ZUERST starten**):
   ```
   ensure lb-phone
   ensure bestell-app-lb-phone
   ```

4. Server neu starten – die App erscheint **im LB Phone**, nicht als Vollbild-Overlay.

> **Wichtig:** Die App hat bewusst **kein `ui_page`** in der `fxmanifest.lua`.
> Mit `ui_page` würde die UI den ganzen Bildschirm überdecken statt im Handy zu erscheinen.
> Die App öffnest du über das **LB Phone** → App „Alpp Food“.

## Konfiguration

Alle Einstellungen in `config.lua`:

| Option | Beschreibung |
|--------|-------------|
| `Config.RestaurantName` | Name des Restaurants |
| `Config.Logo` | Logo-URL |
| `Config.DeliveryFee` | Lieferkosten |
| `Config.StaffJobs` | Job-Namen mit Mitarbeiterzugriff |
| `Config.Menu` | Speisekarte |
| `Config.Categories` | Kategorien |

### Mitarbeiter-Jobs

```lua
Config.StaffJobs = {
    "restaurant",
    "delivery",
    "alpp",
}
```

Leer lassen (`{}`) = jeder Spieler kann den Mitarbeiterbereich nutzen (zum Testen).

## Entwicklung

UI lokal testen (Browser, mit Mock-Daten):

```bash
cd ui
npm run dev
```

Öffne `http://localhost:5173` – die App läuft mit Beispieldaten und vollem Funktionsumfang.

Für FiveM-Entwicklung mit Hot-Reload in `fxmanifest.lua` temporär ändern:

```lua
ui_page "http://localhost:5173/"
```

## Datenpersistenz

Bestellungen werden in `orders.json` im Resource-Ordner gespeichert und überleben Server-Neustarts. Beim ersten Start werden Beispiel-Bestellungen angelegt.

## Technischer Aufbau

```
bestell-app-lb-phone/
├── config.lua          # Konfiguration & Speisekarte
├── fxmanifest.lua
├── client/client.lua   # LB Phone Integration & NUI
├── server/server.lua   # Bestelllogik & Persistenz
├── orders.json         # Gespeicherte Bestellungen
└── ui/                 # React + TypeScript Frontend
    ├── src/
    └── dist/           # Gebautes UI (wird geladen)
```

## Lizenz

MIT
