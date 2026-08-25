local resourceName = GetCurrentResourceName()
local ordersFile = "orders.json"
local orders = {}
local orderCounter = 1000

local function loadOrders()
    local raw = LoadResourceFile(resourceName, ordersFile)
    if raw and raw ~= "" then
        local data = json.decode(raw)
        if data then
            orders = data.orders or {}
            orderCounter = data.counter or 1000
        end
    end
end

local function saveOrders()
    SaveResourceFile(resourceName, ordersFile, json.encode({
        orders = orders,
        counter = orderCounter,
    }), -1)
end

local function isStaff(source)
    if not Config.StaffJobs or #Config.StaffJobs == 0 then
        return true
    end

    local playerJob = nil

    if GetResourceState("es_extended") == "started" then
        local xPlayer = exports["es_extended"]:getSharedObject().GetPlayerFromId(source)
        if xPlayer then
            playerJob = xPlayer.job and xPlayer.job.name
        end
    elseif GetResourceState("qb-core") == "started" then
        local Player = exports["qb-core"]:GetCoreObject().Functions.GetPlayer(source)
        if Player then
            playerJob = Player.PlayerData.job and Player.PlayerData.job.name
        end
    end

    if not playerJob then
        return false
    end

    for _, job in ipairs(Config.StaffJobs) do
        if playerJob == job then
            return true
        end
    end

    return false
end

local function broadcastOrders()
    TriggerClientEvent("alpp-food:ordersUpdated", -1, orders)
end

local function findOrder(orderId)
    for i, order in ipairs(orders) do
        if order.id == orderId then
            return order, i
        end
    end
    return nil, nil
end

local function getDashboardStats()
    local stats = {
        neu = 0,
        in_bearbeitung = 0,
        bereit = 0,
        unterwegs = 0,
        ausgeliefert = 0,
        tagesumsatz = 0,
    }

    local today = os.date("%Y-%m-%d")

    for _, order in ipairs(orders) do
        if order.status == "neu" then stats.neu = stats.neu + 1 end
        if order.status == "in_bearbeitung" then stats.in_bearbeitung = stats.in_bearbeitung + 1 end
        if order.status == "bereit" then stats.bereit = stats.bereit + 1 end
        if order.status == "unterwegs" then stats.unterwegs = stats.unterwegs + 1 end
        if order.status == "ausgeliefert" then stats.ausgeliefert = stats.ausgeliefert + 1 end

        if order.createdAt and order.createdAt:sub(1, 10) == today and order.status ~= "storniert" then
            stats.tagesumsatz = stats.tagesumsatz + (order.total or 0)
        end
    end

    return stats
end

local function generateOrderId()
    orderCounter = orderCounter + 1
    return string.format("AF-%d", orderCounter)
end

AddEventHandler("onResourceStart", function(res)
    if res == resourceName then
        loadOrders()
    end
end)

loadOrders()

RegisterNetEvent("alpp-food:requestStaffStatus", function()
    local src = source
    TriggerClientEvent("alpp-food:staffStatus", src, isStaff(src))
end)

RegisterNetEvent("alpp-food:getOrders", function()
    local src = source
    if not isStaff(src) then return end

    TriggerClientEvent("alpp-food:ordersData", src, {
        orders = orders,
        stats = getDashboardStats(),
    })
end)

RegisterNetEvent("alpp-food:createOrder", function(orderData)
    local src = source

    if not orderData or not orderData.items or #orderData.items == 0 then
        TriggerClientEvent("alpp-food:orderResult", src, { success = false, message = "Warenkorb ist leer." })
        return
    end

    if not orderData.customerName or orderData.customerName == "" then
        TriggerClientEvent("alpp-food:orderResult", src, { success = false, message = "Bitte Name angeben." })
        return
    end

    if not orderData.phone or orderData.phone == "" then
        TriggerClientEvent("alpp-food:orderResult", src, { success = false, message = "Bitte Telefonnummer angeben." })
        return
    end

    if not orderData.address or orderData.address == "" then
        TriggerClientEvent("alpp-food:orderResult", src, { success = false, message = "Bitte Lieferadresse angeben." })
        return
    end

    local subtotal = 0
    for _, item in ipairs(orderData.items) do
        subtotal = subtotal + (item.price * item.quantity)
    end

    local deliveryFee = Config.DeliveryFee
    local total = subtotal + deliveryFee

    local order = {
        id = generateOrderId(),
        status = "neu",
        createdAt = os.date("%Y-%m-%dT%H:%M:%S"),
        customerName = orderData.customerName,
        phone = orderData.phone,
        address = orderData.address,
        note = orderData.note or "",
        paymentMethod = orderData.paymentMethod or "cash",
        items = orderData.items,
        subtotal = subtotal,
        deliveryFee = deliveryFee,
        total = total,
        playerSource = src,
    }

    table.insert(orders, 1, order)
    saveOrders()
    broadcastOrders()

    TriggerClientEvent("alpp-food:orderResult", src, {
        success = true,
        orderId = order.id,
        total = total,
    })
end)

RegisterNetEvent("alpp-food:updateStatus", function(orderId, newStatus)
    local src = source
    if not isStaff(src) then return end

    local order = findOrder(orderId)
    if not order then return end

    local valid = false
    for _, s in ipairs(Config.OrderStatuses) do
        if s == newStatus then valid = true break end
    end
    if not valid then return end

    order.status = newStatus
    order.updatedAt = os.date("%Y-%m-%dT%H:%M:%S")
    saveOrders()
    broadcastOrders()
end)

RegisterNetEvent("alpp-food:markForDelivery", function(orderId)
    local src = source
    if not isStaff(src) then return end

    local order = findOrder(orderId)
    if not order then return end

    order.status = "unterwegs"
    order.updatedAt = os.date("%Y-%m-%dT%H:%M:%S")
    saveOrders()
    broadcastOrders()
end)

RegisterNetEvent("alpp-food:markDelivered", function(orderId)
    local src = source
    if not isStaff(src) then return end

    local order = findOrder(orderId)
    if not order then return end

    order.status = "ausgeliefert"
    order.updatedAt = os.date("%Y-%m-%dT%H:%M:%S")
    saveOrders()
    broadcastOrders()
end)

-- Beispiel-Bestellungen beim ersten Start
CreateThread(function()
    Wait(500)
    if #orders == 0 then
        orders = {
            {
                id = "AF-1001",
                status = "neu",
                createdAt = os.date("%Y-%m-%dT%H:%M:%S"),
                customerName = "Max Mustermann",
                phone = "555-0142",
                address = "Vinewood Blvd 12, Los Santos",
                note = "Bitte klingeln",
                paymentMethod = "cash",
                items = {
                    { id = "burger-classic", name = "Classic Burger", price = 12.90, quantity = 2 },
                    { id = "drink-cola", name = "Cola 0,5L", price = 3.50, quantity = 2 },
                },
                subtotal = 32.80,
                deliveryFee = Config.DeliveryFee,
                total = 32.80 + Config.DeliveryFee,
            },
            {
                id = "AF-1002",
                status = "bereit",
                createdAt = os.date("%Y-%m-%dT%H:%M:%S"),
                customerName = "Anna Schmidt",
                phone = "555-0891",
                address = "Grove Street 5, Los Santos",
                note = "",
                paymentMethod = "card",
                items = {
                    { id = "pizza-margherita", name = "Pizza Margherita", price = 11.90, quantity = 1 },
                    { id = "salat-caesar", name = "Caesar Salad", price = 9.90, quantity = 1 },
                },
                subtotal = 21.80,
                deliveryFee = Config.DeliveryFee,
                total = 21.80 + Config.DeliveryFee,
            },
            {
                id = "AF-1003",
                status = "unterwegs",
                createdAt = os.date("%Y-%m-%dT%H:%M:%S"),
                customerName = "Tom Weber",
                phone = "555-0333",
                address = "Del Perro Pier, Los Santos",
                note = "Am Eingang warten",
                paymentMethod = "phone",
                items = {
                    { id = "pasta-carbonara", name = "Pasta Carbonara", price = 13.50, quantity = 1 },
                    { id = "dessert-tiramisu", name = "Tiramisu", price = 6.90, quantity = 1 },
                },
                subtotal = 20.40,
                deliveryFee = Config.DeliveryFee,
                total = 20.40 + Config.DeliveryFee,
            },
        }
        orderCounter = 1003
        saveOrders()
    end
end)
