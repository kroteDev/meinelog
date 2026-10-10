# frozen_string_literal: true

class Api::V1::CommentsController < ApplicationController
  include Ownable

  SORTABLE_FIELDS = %w[created_at updated_at].freeze

  # GET /api/v1/tasks/:task_id/comments
  # Optional sorting: ?sort=created_at (asc) or ?sort=-updated_at (desc)
  def index
    comments = owned_collection.order(sort_clause)

    render json: {
      data: comments.map { |comment| CommentSerializer.new(comment).serializable_hash[:data][:attributes] }
    }, status: :ok
  end

  # GET /api/v1/tasks/:task_id/comments/:id
  def show
    render json: {
      data: CommentSerializer.new(@comment).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  # POST /api/v1/tasks/:task_id/comments
  def create
    comment = owned_collection.build(comment_params.merge(user: current_user))

    if comment.save
      render json: {
        data: CommentSerializer.new(comment).serializable_hash[:data][:attributes]
      }, status: :created
    else
      render json: {
        errors: comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tasks/:task_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: {
        data: CommentSerializer.new(@comment).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        errors: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tasks/:task_id/comments/:id
  def destroy
    @comment.destroy
    head :no_content
  end

  private

  # Parent task scoped to the token owner: a task_id from another
  # user resolves to 404. Overrides Ownable#owned_collection, which
  # the concern explicitly supports.
  def owned_collection
    current_user.tasks.find(params[:task_id]).comments
  end

  def comment_params
    params.require(:comment).permit(:description)
  end

  def sort_clause
    field = params[:sort].to_s
    direction = field.start_with?("-") ? :desc : :asc
    field = field.delete_prefix("-")

    return { created_at: :desc } unless SORTABLE_FIELDS.include?(field)

    { field => direction }
  end
end
