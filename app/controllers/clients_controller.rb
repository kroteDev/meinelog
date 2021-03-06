class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!
  # GET /clients
  # GET /clients.json
  def index
    @clients = current_user.clients.all
  end

  # GET /clients/1
  # GET /clients/1.json
  def show
  end

  # GET /clients/new
  def new
    @client = current_user.clients.build
  end

  # GET /clients/1/edit
  def edit
  end

  # POST /clients
  # POST /clients.json
  def create
    @client = current_user.clients.build(client_params)

    respond_to do |format|
      if @client.save
        format.html { redirect_to clients_path, notice: 'Cliente criado com sucesso' }
        format.json{redirect_to root_url}
      else
        format.html { render :new }
        format.json{redirect_to root_url}
      end
    end
  end

  # PATCH/PUT /clients/1
  # PATCH/PUT /clients/1.json
  def update
    respond_to do |format|
      if @client.update(client_params)
        format.html { redirect_to clients_path, notice: 'Cliente atualizado com sucesso.' }
        format.json{redirect_to root_url}
      else
        format.html { render :edit }
        format.json{redirect_to root_url}
      end
    end
  end

  # DELETE /clients/1
  # DELETE /clients/1.json
  def destroy
    @client.destroy
    respond_to do |format|
      format.html { redirect_to clients_url, notice: 'Cliente e atividades deletadas.' }
      format.json{redirect_to root_url}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client
      @client = current_user.clients.find(params[:id])
      rescue ActiveRecord::RecordNotFound
      redirect_to root_url
    end
    # Never trust parameters from the scary internet, only allow the white list through.
    def client_params
      params.require(:client).permit(:nome, :logo)
    end
    
end
