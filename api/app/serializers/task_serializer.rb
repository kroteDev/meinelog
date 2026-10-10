class TaskSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :complete, :priority, :due_date, :user_id, :project_id, :created_at, :updated_at
end
