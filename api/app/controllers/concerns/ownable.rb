# frozen_string_literal: true

# Enforces per-user ownership on resource controllers.
#
# Including controllers get, for free:
# - JWT authentication on every action (`authenticate_user!`)
# - Member actions (`show`, `update`, `destroy`) scoped to the token
#   owner: records from other users resolve to 404.
#
# Convention: the resource collection is `current_user.<controller_name>`
# (e.g. `ProjectsController` -> `current_user.projects`) and the member
# ivar is the singular (`@project`). Override `owned_collection` or
# `owned_resource_name` in the controller for non-standard cases.
#
# Usage:
#   class Api::V1::ProjectsController < ApplicationController
#     include Ownable
#     ...
#   end
module Ownable
  extend ActiveSupport::Concern

  included do
    include RackSessionsFix
    before_action :authenticate_user!
    before_action :set_owned_resource, only: %i[show update destroy]
  end

  private

  def owned_collection
    current_user.public_send(controller_name)
  end

  def owned_resource_name
    controller_name.singularize
  end

  def set_owned_resource
    instance_variable_set("@#{owned_resource_name}", owned_collection.find(params[:id]))
  end
end
