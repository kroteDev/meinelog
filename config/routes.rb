Rails.application.routes.draw do
  resources :comments
  root 'home#index'
  devise_for :users    
  resources :activities, :clients , except: [:show]  
  
  match 'auth/:provider/callback', to: 'sessions#create', via: [:get, :post] , as: 'connect'
  match 'auth/failure', to: redirect('/'), via: [:get, :post], as: 'connect_error'
  match 'signout', to: 'sessions#destroy', via: [:get, :post], as: 'signout'
  
  authenticated :users do
    root "activities#index", as: :authenticated_root
  end
  
  
end
