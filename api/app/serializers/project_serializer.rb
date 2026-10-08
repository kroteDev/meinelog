class ProjectSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :description, :user_id, :created_at, :updated_at
end
