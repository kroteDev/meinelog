class HomeController < ApplicationController
  def index
  	if current_user
  		redirect_to activities_path
  	end
  end
end
