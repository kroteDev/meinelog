class ActivitiesController < ApplicationController
  before_action :set_activity, only: [:show, :edit, :update, :destroy]
  before_action :prioridades
  before_action :authenticate_user!
  # GET /activities
  # GET /activities.json
  def index
    respond_to do |format|
      format.html{  @activities = current_user.activities.where(nil).order('day DESC').paginate(:page => params[:page], :per_page => 8)
        filtering_params(params).each do |key, value|
          #@activities = @activities.public_send(key,value).paginate(:page => params[:page], :per_page => 8) if value.present?
          @activities = @activities.public_send(key,value) if value.present?
        end
      }
      format.json{redirect_to root_url}
    end    
    @clients = current_user.clients.all.order('nome ASC')
  end

  # GET /activities/1
  # GET /activities/1.json
  def show
  end

  # GET /activities/new
  def new
    @activity = current_user.activities.build
    @clients = current_user.clients.all.order('nome ASC')
  end

  # GET /activities/1/edit
  def edit
    @clients = current_user.clients.all.order('nome ASC')
    @comments = Comment.where(activity_id: @activity)
  end

  # POST /activities
  # POST /activities.json
  def create
    @activity = current_user.activities.build(activity_params)
    respond_to do |format|
      if @activity.save
        format.html { redirect_to activities_path, notice: 'A Atividade foi registrada com sucesso.' }
        format.json{redirect_to root_url}
      else
        format.html { render :new }
        format.json{redirect_to root_url}
      end
    end
  end

  # PATCH/PUT /activities/1
  # PATCH/PUT /activities/1.json
  def update
    respond_to do |format|
      if @activity.update(activity_params)
        format.html { redirect_to activities_path, notice: 'A Atividade foi atualizada com sucesso.' }
        format.json{redirect_to root_url}
      else
        format.html { render :edit }
        format.json{redirect_to root_url}
      end
    end
  end

  # DELETE /activities/1
  # DELETE /activities/1.json
  def destroy
    @activity.destroy
    respond_to do |format|
      format.html { redirect_to activities_url, notice: 'Atividade deletada.' }
      format.json{redirect_to root_url}
    end
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      @activity = current_user.activities.find(params[:id])
      rescue ActiveRecord::RecordNotFound
      redirect_to root_url, notice: "Atividade não encontrada ou não foi criada por você."
    end
    def filtering_params(params)
      params.slice(:status, :projeto, :prioridade)
    end
    # Never trust parameters from the scary internet, only allow the white list through.
    def activity_params
      params.require(:activity).permit(:title, :description, :day, :duration, :priority, :client_id, :complete)
    end
    def prioridades
      @prioridade = [['Muito Baixa', 1], ['Baixa', 2], ['Média', 3], ['Alta', 4], ['Muito Alta', 5]]
    end
end
