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
    local url = GetResourceMetadata(GetCurrentResourceName(), "ui_page", 0)

    local added, errorMessage = exports["lb-phone"]:AddCustomApp({
        identifier = identifier,
        name = Config.Name,
        description = Config.Description,
        developer = Config.Developer,
        defaultApp = Config.DefaultApp,
        size = 245760,
        ui = url:find("http") and url or GetCurrentResourceName() .. "/" .. url,
        icon = "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/dist/icon.svg",
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
    TriggerServerEvent("alpp-food:requestInit")
    cb("ok")
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

-- Server Events
RegisterNetEvent("alpp-food:initData", function(data)
    sendAppMessage("initData", data)
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
