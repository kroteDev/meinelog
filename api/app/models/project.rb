class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :nullify

  validates :name, presence: true
  validates :description, presence: true
end
