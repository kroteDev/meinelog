class Activity < ActiveRecord::Base
  belongs_to :client
  scope :status, -> (complete)  { where complete: complete }
  scope :client, -> (client_id) { where client_id: client_id }
end