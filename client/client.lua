local identifier = Config.Identifier

while GetResourceState("lb-phone") ~= "started" do
    Wait(500)
end

local function sendAppMessage(action, data)
    exports["lb-phone"]:SendCustomAppMessage(identifier, {
        action = action,
        data = data,
    })
end

local function addApp()
    local resource = GetCurrentResourceName()
    local uiPath = "ui/dist/index.html"

    local added, errorMessage = exports["lb-phone"]:AddCustomApp({
        identifier = identifier,
        name = Config.Name,
        description = Config.Description,
        developer = Config.Developer,
        defaultApp = Config.DefaultApp,
        size = 245760,
        ui = resource .. "/" .. uiPath,
        icon = "https://cfx-nui-" .. resource .. "/ui/dist/icon.svg",
        fixBlur = true,
    })

    if not added then
        print("[Alpp Food] Could not add app:", errorMessage)
    end
end

addApp()

AddEventHandler("onResourceStart", function(resource)
    if resource == "lb-phone" then
        addApp()
    end
end)

-- NUI Callbacks
RegisterNUICallback("getInitData", function(_, cb)
    cb({
        restaurant = {
            name = Config.RestaurantName,
            tagline = Config.RestaurantTagline,
            logo = Config.Logo,
            deliveryFee = Config.DeliveryFee,
            minOrder = Config.MinOrder,
        },
        menu = Config.Menu,
        categories = Config.Categories,
        paymentMethods = Config.PaymentMethods,
        isStaff = false,
        phoneSafeTop = Config.PhoneSafeTop,
        phoneSafeSide = Config.PhoneSafeSide,
    })

    TriggerServerEvent("alpp-food:requestStaffStatus")
end)

RegisterNUICallback("getOrders", function(_, cb)
    TriggerServerEvent("alpp-food:getOrders")
    cb("ok")
end)

RegisterNUICallback("createOrder", function(data, cb)
    TriggerServerEvent("alpp-food:createOrder", data)
    cb("ok")
end)

RegisterNUICallback("updateStatus", function(data, cb)
    TriggerServerEvent("alpp-food:updateStatus", data.orderId, data.status)
    cb("ok")
end)

RegisterNUICallback("markForDelivery", function(data, cb)
    TriggerServerEvent("alpp-food:markForDelivery", data.orderId)
    cb("ok")
end)

RegisterNUICallback("markDelivered", function(data, cb)
    TriggerServerEvent("alpp-food:markDelivered", data.orderId)
    cb("ok")
end)

RegisterNUICallback("getPlayerPhone", function(_, cb)
    local phone = ""

    if GetResourceState("lb-phone") == "started" then
        local number = exports["lb-phone"]:GetEquippedPhoneNumber()
        if number then
            phone = exports["lb-phone"]:FormatNumber(number) or number
        end
    end

    cb({ phone = phone })
end)

RegisterNUICallback("getPlayerLocation", function(_, cb)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)

    local streetHash, crossingHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local street = GetStreetNameFromHashKey(streetHash) or ""
    local crossing = GetStreetNameFromHashKey(crossingHash) or ""

    local address = nil

    if street ~= "" then
        if crossing ~= "" then
            address = street .. " / " .. crossing
        else
            address = street
        end
    end

    if not address or address == "" then
        local zone = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))
        if zone and zone ~= "" and zone ~= "NULL" then
            address = zone
        else
            address = string.format("Position (%.0f, %.0f)", coords.x, coords.y)
        end
    end

    cb({
        x = coords.x + 0.0,
        y = coords.y + 0.0,
        z = coords.z + 0.0,
        address = address,
    })
end)

RegisterNUICallback("setDeliveryWaypoint", function(data, cb)
    if data and data.x and data.y then
        SetNewWaypoint(data.x + 0.0, data.y + 0.0)
    end
    cb("ok")
end)

-- Server Events
RegisterNetEvent("alpp-food:staffStatus", function(isStaff)
    sendAppMessage("staffStatus", { isStaff = isStaff })
end)

RegisterNetEvent("alpp-food:ordersData", function(data)
    sendAppMessage("ordersData", data)
end)

RegisterNetEvent("alpp-food:ordersUpdated", function(updatedOrders)
    sendAppMessage("ordersUpdated", updatedOrders)
end)

RegisterNetEvent("alpp-food:orderResult", function(result)
    sendAppMessage("orderResult", result)

    if result.success then
        exports["lb-phone"]:SendNotification({
            app = identifier,
            title = "Bestellung aufgegeben",
            content = "Deine Bestellung " .. result.orderId .. " wurde empfangen.",
        })
    end
end)
