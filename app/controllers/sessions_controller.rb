class SessionsController < ApplicationController
	def create		
		@user = User.from_omniauth(request.env['omniauth.auth'])
		sign_in @user
		redirect_to activities_url
	end
	def destroy
    sign_out current_user
    redirect_to root_url
  end
end