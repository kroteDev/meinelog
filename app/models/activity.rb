class Activity < ActiveRecord::Base
  belongs_to :client
  scope :status, -> (complete)  { where complete: complete }
  scope :projeto, -> (client_id) { where client_id: client_id }
  scope :prioridade, -> (priority)  { where priority: priority }
  validates_presence_of :title, :priority,  :client_id
end