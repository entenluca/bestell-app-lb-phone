Config = {}

Config.Identifier = "alpp-food"
Config.DefaultApp = true
Config.Name = "Alpp Food"
Config.Description = "Essen bestellen & ausliefern"
Config.Developer = "Alpp Restaurant"

-- Restaurant
Config.RestaurantName = "Alpp Kitchen"
Config.RestaurantTagline = "Frisch. Schnell. Lecker."
Config.Logo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop"
Config.DeliveryFee = 4.50
Config.MinOrder = 0

-- Mitarbeiter: Job-Namen die Zugriff auf den Mitarbeiterbereich haben
-- Leer lassen = jeder Spieler kann Mitarbeiterbereich nutzen (zum Testen)
Config.StaffJobs = {
    "restaurant",
    "delivery",
    "alpp",
}

-- Beispiel-Speisekarte
Config.Menu = {
    {
        id = "burger-classic",
        name = "Classic Burger",
        description = "Saftiges Rindfleisch, Salat, Tomate, hausgemachte Sauce",
        price = 12.90,
        category = "burger",
        image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    },
    {
        id = "burger-cheese",
        name = "Cheese Burger",
        description = "Doppelter Cheddar, karamellisierte Zwiebeln, Brioche-Bun",
        price = 14.50,
        category = "burger",
        image = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    },
    {
        id = "burger-veggie",
        name = "Veggie Burger",
        description = "Knuspriges Gemüse-Patty mit Avocado und Rucola",
        price = 13.90,
        category = "burger",
        image = "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop",
    },
    {
        id = "pizza-margherita",
        name = "Pizza Margherita",
        description = "Tomatensauce, Mozzarella, frisches Basilikum",
        price = 11.90,
        category = "pizza",
        image = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    },
    {
        id = "pizza-pepperoni",
        name = "Pizza Pepperoni",
        description = "Extra Käse, würzige Pepperoni, Oregano",
        price = 13.90,
        category = "pizza",
        image = "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
    },
    {
        id = "pizza-quattro",
        name = "Quattro Formaggi",
        description = "Vier Käsesorten auf knusprigem Teig",
        price = 14.90,
        category = "pizza",
        image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    },
    {
        id = "pasta-carbonara",
        name = "Pasta Carbonara",
        description = "Cremige Sauce, Speck, Parmesan, Eigelb",
        price = 13.50,
        category = "pasta",
        image = "https://images.unsplash.com/photo-1612874741227-4c95b1a2d0c0?w=600&h=400&fit=crop",
    },
    {
        id = "pasta-bolognese",
        name = "Spaghetti Bolognese",
        description = "Langsam geschmorte Rindfleischsauce, frische Kräuter",
        price = 12.90,
        category = "pasta",
        image = "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&h=400&fit=crop",
    },
    {
        id = "salat-caesar",
        name = "Caesar Salad",
        description = "Römersalat, Croutons, Parmesan, Caesar-Dressing",
        price = 9.90,
        category = "salate",
        image = "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    },
    {
        id = "salat-greek",
        name = "Griechischer Salat",
        description = "Feta, Oliven, Gurke, Tomate, rote Zwiebel",
        price = 10.50,
        category = "salate",
        image = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    },
    {
        id = "drink-cola",
        name = "Cola 0,5L",
        description = "Eiskalt serviert",
        price = 3.50,
        category = "getraenke",
        image = "https://images.unsplash.com/photo-1622483767728-1f257cba7255?w=600&h=400&fit=crop",
    },
    {
        id = "drink-lemonade",
        name = "Hauslimonade",
        description = "Zitrone & Minze, hausgemacht",
        price = 4.20,
        category = "getraenke",
        image = "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9b?w=600&h=400&fit=crop",
    },
    {
        id = "drink-water",
        name = "Mineralwasser",
        description = "Still oder medium, 0,5L",
        price = 2.90,
        category = "getraenke",
        image = "https://images.unsplash.com/photo-1548839140-29a7492991ef?w=600&h=400&fit=crop",
    },
    {
        id = "dessert-tiramisu",
        name = "Tiramisu",
        description = "Klassisch italienisch, Mascarpone & Espresso",
        price = 6.90,
        category = "desserts",
        image = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
    },
    {
        id = "dessert-brownie",
        name = "Schoko-Brownie",
        description = "Warm serviert mit Vanilleeis",
        price = 5.90,
        category = "desserts",
        image = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop",
    },
}

Config.Categories = {
    { id = "burger", label = "Burger", icon = "🍔" },
    { id = "pizza", label = "Pizza", icon = "🍕" },
    { id = "pasta", label = "Pasta", icon = "🍝" },
    { id = "salate", label = "Salate", icon = "🥗" },
    { id = "getraenke", label = "Getränke", icon = "🥤" },
    { id = "desserts", label = "Desserts", icon = "🍰" },
}

Config.PaymentMethods = {
    { id = "cash", label = "Barzahlung bei Lieferung" },
    { id = "card", label = "Karte bei Lieferung" },
    { id = "phone", label = "Über Handy bezahlt" },
}

Config.OrderStatuses = {
    "neu",
    "in_bearbeitung",
    "bereit",
    "unterwegs",
    "ausgeliefert",
    "storniert",
}
