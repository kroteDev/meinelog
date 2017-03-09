json.extract! client, :id, :nome, :created_at, :updated_at
json.url client_url(client, format: :json)
