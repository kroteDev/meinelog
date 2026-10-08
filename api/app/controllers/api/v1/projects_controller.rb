# frozen_string_literal: true

class Api::V1::ProjectsController < ApplicationController
  include RackSessionsFix
  before_action :authenticate_user!
  before_action :set_project, only: %i[show update destroy]

  SORTABLE_FIELDS = %w[name created_at updated_at].freeze

  # GET /api/v1/projects
  # Optional sorting: ?sort=name (asc) or ?sort=-created_at (desc)
  def index
    projects = current_user.projects.order(sort_clause)

    render json: {
      data: projects.map { |project| ProjectSerializer.new(project).serializable_hash[:data][:attributes] }
    }, status: :ok
  end

  # GET /api/v1/projects/:id
  def show
    render json: {
      data: ProjectSerializer.new(@project).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  # POST /api/v1/projects
  def create
    project = current_user.projects.build(project_params)

    if project.save
      render json: {
        data: ProjectSerializer.new(project).serializable_hash[:data][:attributes]
      }, status: :created
    else
      render json: {
        errors: project.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/projects/:id
  def update
    if @project.update(project_params)
      render json: {
        data: ProjectSerializer.new(@project).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        errors: @project.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/projects/:id
  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_project
    @project = current_user.projects.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:name, :description)
  end

  def sort_clause
    field = params[:sort].to_s
    direction = field.start_with?("-") ? :desc : :asc
    field = field.delete_prefix("-")

    return { created_at: :desc } unless SORTABLE_FIELDS.include?(field)

    { field => direction }
  end
end
