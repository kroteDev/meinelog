class CommentSerializer
  include JSONAPI::Serializer
  attributes :id, :description, :user_id, :commentable_type, :commentable_id, :created_at, :updated_at
end
