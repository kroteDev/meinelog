class Task < ApplicationRecord
  belongs_to :user
  belongs_to :project, optional: true

  enum :priority, { trivial: 0, low: 1, medium: 2, high: 3, critical: 4 }

  has_many :comments, as: :commentable, dependent: :destroy

  validates :title, presence: true
end
