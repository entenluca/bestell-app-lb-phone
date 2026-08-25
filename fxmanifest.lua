fx_version "cerulean"
game "gta5"

title "Alpp Food - LB Phone"
description "Essensbestell- und Liefer-App für LB Phone"
author "Alpp Restaurant"
version "1.0.0"

lua54 "yes"

shared_script "config.lua"
client_script "client/client.lua"
server_script "server/server.lua"

file "ui/dist/**/*"

ui_page "ui/dist/index.html"
