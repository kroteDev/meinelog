class Task < ApplicationRecord
  belongs_to :user

  enum :priority, { trivial: 0, low: 1, medium: 2, high: 3, critical: 4 }

  validates :title, presence: true
end
