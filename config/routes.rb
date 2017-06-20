Rails.application.routes.draw do
  
  root 'home#index'
  devise_for :users    
  resources :clients , except: [:show]  
  resources :activities, except: [:show]  do
    resources :comments    
  end
  match 'auth/:provider/callback', to: 'sessions#create', via: [:get, :post] , as: 'connect'
  match 'auth/failure', to: redirect('/'), via: [:get, :post], as: 'connect_error'
  match 'signout', to: 'sessions#destroy', via: [:get, :post], as: 'signout'
  
  authenticated :users do
    root "activities#index", as: :authenticated_root
  end
  
  
end
