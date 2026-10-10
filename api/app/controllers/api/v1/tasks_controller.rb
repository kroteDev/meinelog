# frozen_string_literal: true

class Api::V1::TasksController < ApplicationController
  include Ownable

  # NOTE: re-declares the Ownable filter with the full member-action
  # list. Rails replaces (not appends) a callback with the same name,
  # so `only: %i[complete]` alone would drop show/update/destroy.
  before_action :set_owned_resource, only: %i[show update destroy complete]

  SORTABLE_FIELDS = %w[title priority due_date created_at updated_at].freeze

  # GET /api/v1/tasks
  # Optional sorting: ?sort=due_date (asc) or ?sort=-priority (desc)
  def index
    tasks = owned_collection.order(sort_clause)

    render json: {
      data: tasks.map { |task| TaskSerializer.new(task).serializable_hash[:data][:attributes] }
    }, status: :ok
  end

  # GET /api/v1/tasks/:id
  def show
    render json: {
      data: TaskSerializer.new(@task).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  # POST /api/v1/tasks
  def create
    task = owned_collection.build(task_params)

    if task.save
      render json: {
        data: TaskSerializer.new(task).serializable_hash[:data][:attributes]
      }, status: :created
    else
      render json: {
        errors: task.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tasks/:id
  def update
    if @task.update(task_params)
      render json: {
        data: TaskSerializer.new(@task).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        errors: @task.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tasks/:id
  def destroy
    @task.destroy
    head :no_content
  end

  # PATCH /api/v1/tasks/:id/complete
  def complete
    if @task.update(complete_params)
      render json: {
        data: TaskSerializer.new(@task).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        errors: @task.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def complete_params
    params.require(:task).permit(:complete)
  end

  def task_params
    params.require(:task).permit(:title, :description, :complete, :priority, :due_date)
  end

  def sort_clause
    field = params[:sort].to_s
    direction = field.start_with?("-") ? :desc : :asc
    field = field.delete_prefix("-")

    return { created_at: :desc } unless SORTABLE_FIELDS.include?(field)

    { field => direction }
  end
end
